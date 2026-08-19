import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { BrandMark } from "@/shared/components/BrandMark";
import { LogoutIcon } from "@/shared/components/Icons";
import { ROUTES } from "@/shared/constants/routes";

/** 로그인 이후 모든 화면이 공유하는 껍데기 — 상단 바 + 가운데 정렬 컨테이너 */
export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-40 bg-brand-500">
        <div className="mx-auto flex h-14 max-w-(--container-shell) items-center gap-3 px-4 sm:px-6">
          <Link
            to={ROUTES.boardList}
            className="flex items-center gap-2 text-white"
          >
            <BrandMark inverted className="size-7 text-[13px]" />
            <span className="text-[15px] font-bold tracking-tight">
              에브리타임 플러스
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1">
            {user && (
              <span className="hidden text-[13px] font-medium text-white/90 sm:inline">
                {user.nickname}님
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              aria-label="로그아웃"
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <LogoutIcon className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-(--container-shell) px-4 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
