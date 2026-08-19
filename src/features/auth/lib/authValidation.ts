export const AUTH_LIMITS = {
  nicknameMax: 10,
  usernameMin: 4,
  usernameMax: 20,
  passwordMin: 8,
  passwordMax: 64,
} as const;

const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9]+$/;

/** 유효하면 null, 아니면 사용자에게 보여줄 메시지 */
export function validateNickname(value: string): string | null {
  if (!value) return "닉네임을 입력해주세요";
  if (value.length > AUTH_LIMITS.nicknameMax) {
    return `닉네임은 ${AUTH_LIMITS.nicknameMax}자 이하로 입력해주세요`;
  }
  if (!NICKNAME_PATTERN.test(value)) {
    return "닉네임에 공백과 특수문자는 사용할 수 없습니다";
  }
  return null;
}

export function validateUsername(value: string): string | null {
  if (!value) return "아이디를 입력해주세요";
  if (
    value.length < AUTH_LIMITS.usernameMin ||
    value.length > AUTH_LIMITS.usernameMax
  ) {
    return `아이디는 ${AUTH_LIMITS.usernameMin}~${AUTH_LIMITS.usernameMax}자로 입력해주세요`;
  }
  if (!USERNAME_PATTERN.test(value)) {
    return "아이디는 영문과 숫자만 사용할 수 있습니다";
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "비밀번호를 입력해주세요";
  if (
    value.length < AUTH_LIMITS.passwordMin ||
    value.length > AUTH_LIMITS.passwordMax
  ) {
    return `비밀번호는 ${AUTH_LIMITS.passwordMin}~${AUTH_LIMITS.passwordMax}자로 입력해주세요`;
  }
  if (/\s/.test(value)) return "비밀번호에 공백은 사용할 수 없습니다";
  return null;
}

export function validatePasswordConfirm(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return "비밀번호를 한 번 더 입력해주세요";
  if (password !== confirm) return "비밀번호가 일치하지 않습니다";
  return null;
}
