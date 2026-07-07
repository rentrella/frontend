"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthCard,
  AuthPage,
  Field,
  LockIcon,
  MailIcon,
  PrimaryButton,
} from "../auth/AuthShell";

const temporaryAccount = {
  email: "s25011@gsm.hs.kr",
  password: "sunwoo4114!",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const canLogin = email.trim().length > 0 && password.trim().length > 0;

  const submitLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[A-Za-z0-9._%+-]+@gsm\.hs\.kr$/.test(normalizedEmail)) {
      setLoginError("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (normalizedEmail !== temporaryAccount.email) {
      setLoginError("계정이 올바르지 않습니다.");
      return;
    }

    if (password !== temporaryAccount.password) {
      setLoginError("비밀번호가 올바르지 않습니다.");
      return;
    }

    setLoginError("");
    router.push("/main");
  };

  return (
    <AuthPage>
      <AuthCard>
        <h2 className="text-[34px] font-black tracking-[-0.04em]">로그인</h2>
        <p className="mt-3 text-[17px] font-medium text-[#7f8da3]">
          Rentrella 계정으로 우산 대여 서비스를 이용하세요.
        </p>

        <form className="mt-8 space-y-5">
          <Field
            icon={<MailIcon />}
            label="이메일"
            onChange={(value) => {
              setEmail(value);
              if (loginError) setLoginError("");
            }}
            placeholder="s25011@gsm.hs.kr"
            type="email"
            value={email}
          />
          <Field
            icon={<LockIcon />}
            label="비밀번호"
            onChange={setPassword}
            placeholder="비밀번호 입력"
            type="password"
            value={password}
          />
          {loginError && (
            <p className="-mt-2 text-[14px] font-bold text-[#ef5f67]">
              {loginError}
            </p>
          )}

          <div className="flex items-center justify-between text-[15px] font-bold">
            <label className="flex items-center gap-2 text-[#8c99ab]">
              <input className="h-4 w-4 accent-[#6db6ed]" type="checkbox" />
              로그인 유지
            </label>
            <Link className="text-[#5daeea]" href="/reset-password">
              비밀번호 찾기
            </Link>
          </div>

          <PrimaryButton disabled={!canLogin} onClick={submitLogin}>
            로그인 하기
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-[16px] font-medium text-[#9aa5b3]">
          계정이 없나요?{" "}
          <Link className="font-black text-[#5daeea]" href="/signup">
            회원가입
          </Link>
        </p>
      </AuthCard>
    </AuthPage>
  );
}
