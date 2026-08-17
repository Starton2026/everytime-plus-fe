import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DEMO_ACCOUNT } from "@/mocks/data/users";
import { toErrorMessage } from "@/shared/api/apiError";
import { Button } from "@/shared/components/Button";
import { TextField } from "@/shared/components/TextField";
import { ROUTES } from "@/shared/constants/routes";

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "authenticated") {
    return <Navigate to={ROUTES.boardList} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!username || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await login({ username, password });
      navigate(ROUTES.boardList, { replace: true });
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setUsername(DEMO_ACCOUNT.username);
    setPassword(DEMO_ACCOUNT.password);
    setError(null);
  };

  return (
    <AuthLayout
      title="에브리타임 플러스"
      description="우리 학교 커뮤니티에 로그인하세요"
      footer={
        <>
          아직 계정이 없나요?{" "}
          <Link
            to={ROUTES.signup}
            className="font-semibold text-brand-600 hover:underline"
          >
            회원가입
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="아이디"
          value={username}
          autoComplete="username"
          placeholder="아이디를 입력하세요"
          onChange={(event) => setUsername(event.target.value)}
        />

        <TextField
          label="비밀번호"
          type="password"
          value={password}
          autoComplete="current-password"
          placeholder="비밀번호를 입력하세요"
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-brand-50 px-3 py-2.5 text-[13px] font-medium text-brand-600"
          >
            {error}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth loading={submitting}>
          로그인
        </Button>
      </form>

      <div className="mt-5 rounded-xl bg-surface-muted p-3.5">
        <p className="text-[12px] leading-relaxed text-ink-500">
          백엔드 연동 전이라 예시 데이터로 동작합니다.
          <br />
          데모 계정{" "}
          <b className="text-ink-700">
            {DEMO_ACCOUNT.username} / {DEMO_ACCOUNT.password}
          </b>
        </p>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="mt-2 text-[12px] font-semibold text-brand-600 hover:underline"
        >
          데모 계정으로 채우기
        </button>
      </div>
    </AuthLayout>
  );
}
