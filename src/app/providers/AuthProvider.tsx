import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getMe, login as requestLogin, signup as requestSignup } from "@/features/auth/api/authApi";
import { AuthContext } from "@/features/auth/model/authContext";
import type { AuthStatus } from "@/features/auth/model/authContext";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/shared/api/authToken";
import type { LoginRequest, SignupRequest, User } from "@/shared/types/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);

  // 앱 실행 시 저장된 토큰으로 로그인 상태를 복원한다. 만료면 정리한다.
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      if (!getAccessToken()) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const me = await getMe();
        if (cancelled) return;
        setUser(me);
        setStatus("authenticated");
      } catch {
        if (cancelled) return;
        clearAccessToken();
        setUser(null);
        setStatus("unauthenticated");
      }
    };

    void restore();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (body: LoginRequest) => {
    const response = await requestLogin(body);
    setAccessToken(response.accessToken);
    setUser(response.user);
    setStatus("authenticated");
  }, []);

  const signup = useCallback(async (body: SignupRequest) => {
    const response = await requestSignup(body);
    setAccessToken(response.accessToken);
    setUser(response.user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ status, user, login, signup, logout }),
    [status, user, login, signup, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
