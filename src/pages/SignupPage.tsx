import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  AUTH_LIMITS,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
  validateUsername,
} from "@/features/auth/lib/authValidation";
import { toErrorMessage } from "@/shared/api/apiError";
import { Button } from "@/shared/components/Button";
import { TextField } from "@/shared/components/TextField";
import { ROUTES } from "@/shared/constants/routes";

interface FieldErrors {
  nickname?: string;
  username?: string;
  password?: string;
  passwordConfirm?: string;
}

export function SignupPage() {
  const { status, signup } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "authenticated") {
    return <Navigate to={ROUTES.boardList} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {
      nickname: validateNickname(nickname) ?? undefined,
      username: validateUsername(username) ?? undefined,
      password: validatePassword(password) ?? undefined,
      passwordConfirm:
        validatePasswordConfirm(password, passwordConfirm) ?? undefined,
    };

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setFormError(null);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      // 회원가입 성공 시 자동 로그인 처리된다.
      await signup({ nickname, username, password });
      navigate(ROUTES.boardList, { replace: true });
    } catch (caught) {
      setFormError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="회원가입"
      description="가입하면 바로 로그인돼요"
      footer={
        <>
          이미 계정이 있나요?{" "}
          <Link
            to={ROUTES.login}
            className="font-semibold text-brand-600 hover:underline"
          >
            로그인
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="닉네임"
          value={nickname}
          maxLength={AUTH_LIMITS.nicknameMax}
          placeholder="10자 이하, 특수문자·공백 불가"
          error={errors.nickname}
          onChange={(event) => setNickname(event.target.value)}
        />

        <TextField
          label="아이디"
          value={username}
          maxLength={AUTH_LIMITS.usernameMax}
          autoComplete="username"
          placeholder="영문·숫자 4~20자"
          error={errors.username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <TextField
          label="비밀번호"
          type="password"
          value={password}
          maxLength={AUTH_LIMITS.passwordMax}
          autoComplete="new-password"
          placeholder="8~64자, 공백 불가"
          error={errors.password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <TextField
          label="비밀번호 확인"
          type="password"
          value={passwordConfirm}
          maxLength={AUTH_LIMITS.passwordMax}
          autoComplete="new-password"
          placeholder="비밀번호를 한 번 더 입력하세요"
          error={errors.passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
        />

        {formError && (
          <p
            role="alert"
            className="rounded-lg bg-brand-50 px-3 py-2.5 text-[13px] font-medium text-brand-600"
          >
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth loading={submitting}>
          가입하기
        </Button>
      </form>
    </AuthLayout>
  );
}
