import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isUnauthorized, toErrorMessage } from "@/shared/api/apiError";
import { ROUTES } from "@/shared/constants/routes";
import { useToast } from "@/shared/hooks/useToast";

/**
 * API 실패를 한곳에서 처리하는 공통 핸들러.
 * 401이면 기능정의서 예외 처리대로 로그아웃 후 로그인 페이지로 보낸다.
 *
 * 데이터 로딩 useEffect의 의존성으로 자주 쓰이므로, 반환하는 함수는 항상 같은 참조를
 * 유지해야 한다. (참조가 바뀌면 불필요한 재요청이 발생한다)
 */
export function useApiErrorHandler() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const latest = useRef({ logout, showToast, navigate });
  latest.current = { logout, showToast, navigate };

  return useCallback((error: unknown) => {
    const handlers = latest.current;

    if (isUnauthorized(error)) {
      handlers.logout();
      handlers.showToast("로그인이 만료되었습니다. 다시 로그인해주세요");
      handlers.navigate(ROUTES.login, { replace: true });
      return;
    }

    handlers.showToast(toErrorMessage(error));
  }, []);
}
