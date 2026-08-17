import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Spinner } from "@/shared/components/Spinner";
import { ROUTES } from "@/shared/constants/routes";

/** 토큰이 없거나 만료되면 로그인 페이지로 보낸다. */
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-7" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
