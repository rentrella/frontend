"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AuthCard,
  AuthPage,
  Field,
  LockIcon,
  MailIcon,
  PrimaryButton,
} from "../auth/AuthShell";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const isSchoolEmail = /^[A-Za-z0-9._%+-]+@gsm\.hs\.kr$/.test(email);
  const passwordStrength = getPasswordStrength(password);
  const canSignup =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    passwordConfirm.trim().length > 0;

  const submitSignup = () => {
    if (!isSchoolEmail) {
      setEmailError("이메일 형식이 올바르지 않아요.");
      return;
    }

    if (!passwordStrength.isValid) {
      setPasswordError("비밀번호는 6~20자, 영문+숫자+특수문자를 포함해야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setEmailError("");
    setPasswordError("");
  };

  return (
    <AuthPage>
      <AuthCard>
        <h2 className="text-[34px] font-black tracking-[-0.04em]">회원가입</h2>

        <form className="mt-8 space-y-5">
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
          {emailError && (
            <p className="-mt-2 text-[14px] font-bold text-[#ef5f67]">
              {emailError}
            </p>
          )}
          <Field
            icon={<LockIcon />}
            label="비밀번호"
            onChange={(value) => {
              setPassword(value);
              if (passwordError) setPasswordError("");
            }}
            placeholder="6~20자 영문+숫자+특수문자"
            type="password"
            value={password}
          />
          {password && (
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
          {passwordError && (
            <p className="-mt-2 text-[14px] font-bold text-[#ef5f67]">
              {passwordError}
            </p>
          )}
          <Field
            icon={<LockIcon />}
            label="비밀번호 확인"
            onChange={setPasswordConfirm}
            placeholder="비밀번호 다시 입력"
            type="password"
            value={passwordConfirm}
          />

          <PrimaryButton disabled={!canSignup} onClick={submitSignup}>
            회원가입 하기
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-[16px] font-medium text-[#9aa5b3]">
          이미 계정이 있나요?{" "}
          <Link className="font-black text-[#5daeea]" href="/login">
            로그인
          </Link>
        </p>
      </AuthCard>
    </AuthPage>
  );
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
