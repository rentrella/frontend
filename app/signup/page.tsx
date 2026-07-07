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
  const [emailError, setEmailError] = useState("");
  const isSchoolEmail = /^[A-Za-z0-9._%+-]+@gsm\.hs\.kr$/.test(email);
  const canSignup = email.trim().length > 0 && password.trim().length > 0;

  const submitSignup = () => {
    if (!isSchoolEmail) {
      setEmailError("이메일 형식이 올바르지 않아요.");
      return;
    }

    setEmailError("");
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
            placeholder="student@gsm.hs.kr"
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
            onChange={setPassword}
            placeholder="8자 이상 입력"
            type="password"
            value={password}
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
