import { Route, Routes } from "react-router-dom";
import { AppShell } from "@/app/layouts/AppShell";
import { ProtectedRoute } from "@/app/routes/ProtectedRoute";
import { BoardListPage } from "@/pages/BoardListPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { PostEditPage } from "@/pages/PostEditPage";
import { PostListPage } from "@/pages/PostListPage";
import { PostWritePage } from "@/pages/PostWritePage";
import { SignupPage } from "@/pages/SignupPage";
import { ROUTES } from "@/shared/constants/routes";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.signup} element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path={ROUTES.boardList} element={<BoardListPage />} />
          <Route path="/boards/:boardId/posts" element={<PostListPage />} />
          <Route path="/boards/:boardId/posts/new" element={<PostWritePage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/posts/:postId/edit" element={<PostEditPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
