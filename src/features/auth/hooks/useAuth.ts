import { useContext } from "react";
import { AuthContext } from "@/features/auth/model/authContext";
import type { AuthContextValue } from "@/features/auth/model/authContext";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
