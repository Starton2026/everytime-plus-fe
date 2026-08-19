import type { ReactNode } from "react";
import { BrandMark } from "@/shared/components/BrandMark";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-5 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <BrandMark className="size-12 text-lg" />
          <h1 className="mt-3.5 text-[22px] font-bold tracking-tight text-ink-900">
            {title}
          </h1>
          <p className="mt-1 text-[13px] text-ink-400">{description}</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {children}
        </div>

        <div className="mt-5 text-center text-[13px] text-ink-400">{footer}</div>
      </div>
    </div>
  );
}
