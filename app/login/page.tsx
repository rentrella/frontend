"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

const authStorageKey = "rentrella-authenticated";
const rememberedEmailStorageKey = "rentrella-remembered-email";
const rememberStorageKey = "rentrella-remember-login";
const rememberedPasswordStorageKey = "rentrella-remembered-password";

function getStoredValue(key: string) {
  if (typeof window === "undefined") return "";

  return window.localStorage.getItem(key) ?? "";
}

function getStoredRememberLogin() {
  if (typeof window === "undefined") return false;

  return window.localStorage.getItem(rememberStorageKey) === "true";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(() => getStoredValue(rememberedEmailStorageKey));
  const [password, setPassword] = useState(() => getStoredValue(rememberedPasswordStorageKey));
  const [rememberLogin, setRememberLogin] = useState(() => getStoredRememberLogin());
  const [loginError, setLoginError] = useState("");
  const canLogin = email.trim().length > 0 && password.trim().length > 0;

  useEffect(() => {
    const authenticated =
      window.localStorage.getItem(authStorageKey) === "true" ||
      window.sessionStorage.getItem(authStorageKey) === "true";

    if (authenticated) {
      router.replace("/main");
    }
  }, [router]);

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
    window.sessionStorage.setItem(authStorageKey, "true");
    if (rememberLogin) {
      window.localStorage.setItem(authStorageKey, "true");
      window.localStorage.setItem(rememberedEmailStorageKey, normalizedEmail);
      window.localStorage.setItem(rememberedPasswordStorageKey, password);
      window.localStorage.setItem(rememberStorageKey, "true");
    } else {
      window.localStorage.removeItem(authStorageKey);
      window.localStorage.removeItem(rememberedEmailStorageKey);
      window.localStorage.removeItem(rememberedPasswordStorageKey);
      window.localStorage.removeItem(rememberStorageKey);
    }
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
              <input
                checked={rememberLogin}
                className="h-4 w-4 accent-[#6db6ed]"
                onChange={(event) => setRememberLogin(event.target.checked)}
                type="checkbox"
              />
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
