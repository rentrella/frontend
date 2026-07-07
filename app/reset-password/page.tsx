"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasSentCode, setHasSentCode] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);
  const isSchoolEmail = /^[A-Za-z0-9._%+-]+@gsm\.hs\.kr$/.test(email);
  const passwordStrength = getPasswordStrength(newPassword);
  const canSendCode = email.trim().length > 0 && codeTimer === 0;
  const canConfirmCode = code.trim().length > 0;
  const canResetPassword =
    email.trim().length > 0 &&
    code.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    newPasswordConfirm.trim().length > 0;

  useEffect(() => {
    if (codeTimer === 0) return;

    const timerId = window.setTimeout(() => {
      setCodeTimer((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [codeTimer]);

  const sendCode = () => {
    if (!isSchoolEmail) {
      setEmailError("이메일 형식이 올바르지 않아요.");
      return;
    }

    setEmailError("");
    setHasSentCode(true);
    setCodeTimer(180);
  };

  const resetPassword = () => {
    if (!isSchoolEmail) {
      setEmailError("이메일 형식이 올바르지 않아요.");
      return;
    }

    if (!passwordStrength.isValid) {
      setPasswordError("비밀번호는 6~20자, 영문+숫자+특수문자를 포함해야 합니다.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setEmailError("");
    setPasswordError("");
  };

  return (
    <AuthPage>
      <AuthCard>
        <form className="space-y-6">
          <div className="grid grid-cols-[1fr_auto] items-end gap-4 max-sm:grid-cols-1">
            <Field
              icon={<MailIcon />}
              label="이메일"
              onChange={(value) => {
                setEmail(value);
                if (emailError) setEmailError("");
              }}
              placeholder="s25011@gsm.hs.kr"
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
              onClick={sendCode}
              type="button"
            >
              인증코드 발송
            </button>
          </div>
          {hasSentCode && (
            <div className="-mt-4 flex justify-end">
              {codeTimer > 0 ? (
                <span className="text-[14px] font-black text-[#7f8da3]">
                  재발송 {formatTimer(codeTimer)}
                </span>
              ) : (
                <button
                  className={[
                    "text-[14px] font-black",
                    email.trim().length > 0
                      ? "text-[#5daeea]"
                      : "cursor-not-allowed text-[#b8c2cf]",
                  ].join(" ")}
                  disabled={email.trim().length === 0}
                  onClick={sendCode}
                  type="button"
                >
                  재발송
                </button>
              )}
            </div>
          )}
          {emailError && (
            <p className="-mt-4 text-[14px] font-bold text-[#ef5f67]">
              {emailError}
            </p>
          )}

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
            onChange={(value) => {
              setNewPassword(value);
              if (passwordError) setPasswordError("");
            }}
            placeholder="6~20자 영문+숫자+특수문자"
            type="password"
            value={newPassword}
          />
          {newPassword && (
            <div className="-mt-2 rounded-[18px] bg-[#f6f9fc] px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[14px] font-black text-[#7f8da3]">
                  비밀번호 안전도
                </span>
                <span
                  className={[
                    "text-[14px] font-black",
                    passwordStrength.color,
                  ].join(" ")}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <span
                    className={[
                      "h-2 rounded-full",
                      index < passwordStrength.level
                        ? passwordStrength.barColor
                        : "bg-[#e7edf4]",
                    ].join(" ")}
                    key={index}
                  />
                ))}
              </div>
              <p className="mt-3 text-[13px] font-bold text-[#9aa5b3]">
                6~20자, 영문+숫자+특수문자 포함
              </p>
            </div>
          )}
          <Field
            icon={<LockIcon />}
            label="새 비밀번호 확인"
            onChange={(value) => {
              setNewPasswordConfirm(value);
              if (passwordError) setPasswordError("");
            }}
            placeholder="새 비밀번호 다시 입력"
            type="password"
            value={newPasswordConfirm}
          />
          {passwordError && (
            <p className="-mt-2 text-[14px] font-bold text-[#ef5f67]">
              {passwordError}
            </p>
          )}

          <PrimaryButton disabled={!canResetPassword} onClick={resetPassword}>
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

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getPasswordStrength(password: string) {
  const hasLength = password.length >= 6 && password.length <= 20;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasLength, hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  if (score >= 4) {
    return {
      barColor: "bg-[#45bd74]",
      color: "text-[#2fa461]",
      isValid: true,
      label: "안전",
      level: 3,
    };
  }

  if (score >= 3) {
    return {
      barColor: "bg-[#f0b84f]",
      color: "text-[#d49423]",
      isValid: false,
      label: "보통",
      level: 2,
    };
  }

  return {
    barColor: "bg-[#ef5f67]",
    color: "text-[#ef5f67]",
    isValid: false,
    label: "약함",
    level: 1,
  };
}
