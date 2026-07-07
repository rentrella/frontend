"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AuthCard,
  AuthPage,
  Field,
  KeyIcon,
  LockIcon,
  MailIcon,
  PrimaryButton,
} from "../auth/AuthShell";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const canSendCode = email.trim().length > 0;
  const canConfirmCode = code.trim().length > 0;
  const canResetPassword =
    email.trim().length > 0 &&
    code.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    newPasswordConfirm.trim().length > 0;

  return (
    <AuthPage>
      <AuthCard>
        <div className="flex items-center gap-4">
          <Step active label="이메일 인증" number={1} />
          <span className="h-px flex-1 bg-[#dbe9f5]" />
          <Step label="인증코드 확인" number={2} />
          <span className="h-px flex-1 bg-[#dbe9f5]" />
          <Step label="비밀번호 변경" number={3} />
        </div>

        <form className="mt-8 space-y-6">
          <div className="grid grid-cols-[1fr_auto] items-end gap-4 max-sm:grid-cols-1">
            <Field
              icon={<MailIcon />}
              label="이메일"
              onChange={setEmail}
              placeholder="example@email.com"
              type="email"
              value={email}
            />
            <button
              className={[
                "h-[74px] rounded-[22px] px-8 text-[18px] font-black",
                canSendCode
                  ? "bg-[#6db6ed] text-white shadow-[0_12px_22px_rgba(109,182,237,0.2)]"
                  : "cursor-not-allowed bg-[#edf2f7] text-[#aeb9c8]",
              ].join(" ")}
              disabled={!canSendCode}
              type="button"
            >
              인증코드 발송
            </button>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-end gap-4 max-sm:grid-cols-1">
            <Field
              icon={<KeyIcon />}
              label="인증코드"
              onChange={setCode}
              placeholder="6자리 숫자 입력"
              value={code}
            />
            <button
              className={[
                "h-[74px] rounded-[22px] px-12 text-[18px] font-black",
                canConfirmCode
                  ? "bg-[#6db6ed] text-white shadow-[0_12px_22px_rgba(109,182,237,0.2)]"
                  : "cursor-not-allowed bg-[#edf2f7] text-[#aeb9c8]",
              ].join(" ")}
              disabled={!canConfirmCode}
              type="button"
            >
              확인
            </button>
          </div>

          <div className="h-px bg-[#e7eef5]" />

          <Field
            icon={<LockIcon />}
            label="새 비밀번호"
            onChange={setNewPassword}
            placeholder="8자 이상 입력"
            type="password"
            value={newPassword}
          />
          <Field
            icon={<LockIcon />}
            label="새 비밀번호 확인"
            onChange={setNewPasswordConfirm}
            placeholder="새 비밀번호 다시 입력"
            type="password"
            value={newPasswordConfirm}
          />

          <PrimaryButton disabled={!canResetPassword}>
            비밀번호 변경하기
          </PrimaryButton>
        </form>

        <p className="mt-8 text-center text-[16px] font-medium text-[#9aa5b3]">
          비밀번호가 기억나셨나요?{" "}
          <Link className="font-black text-[#5daeea]" href="/login">
            로그인으로 돌아가기
          </Link>
        </p>
      </AuthCard>
    </AuthPage>
  );
}

function Step({
  active = false,
  label,
  number,
}: {
  active?: boolean;
  label: string;
  number: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={[
          "flex h-9 w-9 items-center justify-center rounded-full text-[16px] font-black",
          active
            ? "border-2 border-[#6db6ed] bg-[#eaf6ff] text-[#6db6ed]"
            : "bg-[#f2f6fa] text-[#9aa8bb]",
        ].join(" ")}
      >
        {number}
      </span>
      <span
        className={[
          "whitespace-nowrap text-[15px] font-black max-sm:hidden",
          active ? "text-[#111728]" : "text-[#9aa8bb]",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}
