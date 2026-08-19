import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  getMe,
  login as requestLogin,
  signup as requestSignup,
} from "@/features/auth/api/authApi";
import { AuthContext } from "@/features/auth/model/authContext";
import type { AuthStatus } from "@/features/auth/model/authContext";
import {
  clearSession,
  getAccessToken,
  setAccessToken,
} from "@/shared/api/authSession";
import type { AuthResponse, LoginRequest, SignupRequest, User } from "@/shared/types/auth";

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
        clearSession();
        setUser(null);
        setStatus("unauthenticated");
      }
    };

    void restore();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * 로그인·회원가입 응답에는 access_token과 nickname만 있고 id가 없다.
   * 사용자 정보를 한 형태로 다루기 위해 토큰 저장 후 /auth/me로 한 번 더 조회한다.
   */
  const applyAuthResponse = useCallback(async (response: AuthResponse) => {
    setAccessToken(response.accessToken);

    const me = await getMe();
    setUser(me);
    setStatus("authenticated");
  }, []);

  const login = useCallback(
    async (body: LoginRequest) => {
      await applyAuthResponse(await requestLogin(body));
    },
    [applyAuthResponse],
  );

  const signup = useCallback(
    async (body: SignupRequest) => {
      await applyAuthResponse(await requestSignup(body));
    },
    [applyAuthResponse],
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ status, user, login, signup, logout }),
    [status, user, login, signup, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
