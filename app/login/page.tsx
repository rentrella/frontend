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

const authStorageKey = "rentrella-authenticated";
const authTokenStorageKey = "rentrella-auth-token";
const authUserStorageKey = "rentrella-auth-user";
const rememberedEmailStorageKey = "rentrella-remembered-email";
const rememberStorageKey = "rentrella-remember-login";
const legacyRememberedPasswordStorageKey = "rentrella-remembered-password";

type LoginResponse = {
  data?: unknown;
  error?: string;
  message?: string;
  msg?: string;
  status?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: unknown;
};

function getStoredValue(key: string) {
  if (typeof window === "undefined") return "";

  return window.localStorage.getItem(key) ?? "";
}

function getStoredRememberLogin() {
  if (typeof window === "undefined") return false;

  return window.localStorage.getItem(rememberStorageKey) === "true";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getResponseMessage(payload: unknown, fallback: string) {
  if (!isRecord(payload)) {
    return fallback;
  }

  const message = payload.msg ?? payload.message ?? payload.error;

  return typeof message === "string" && message.trim().length > 0
    ? message
    : fallback;
}

function findToken(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }

  for (const key of ["token", "accessToken", "access_token", "jwt"]) {
    const value = payload[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return findToken(payload.data);
}

function findUser(payload: unknown): unknown {
  if (!isRecord(payload)) {
    return null;
  }

  return payload.user ?? (isRecord(payload.data) ? payload.data.user : null);
}

function persistLogin(payload: LoginResponse, rememberLogin: boolean, email: string) {
  const persistentStorage = rememberLogin ? window.localStorage : window.sessionStorage;
  const temporaryStorage = rememberLogin ? window.sessionStorage : window.localStorage;
  const token = findToken(payload);
  const user = findUser(payload);

  window.localStorage.removeItem(authTokenStorageKey);
  window.sessionStorage.removeItem(authTokenStorageKey);
  window.localStorage.removeItem(authUserStorageKey);
  window.sessionStorage.removeItem(authUserStorageKey);
  window.sessionStorage.setItem(authStorageKey, "true");
  persistentStorage.setItem(authStorageKey, "true");
  temporaryStorage.removeItem(authStorageKey);

  if (token) {
    persistentStorage.setItem(authTokenStorageKey, token);
  }

  if (user) {
    persistentStorage.setItem(authUserStorageKey, JSON.stringify(user));
  }

  if (rememberLogin) {
    window.localStorage.setItem(rememberedEmailStorageKey, email);
    window.localStorage.setItem(rememberStorageKey, "true");
  } else {
    window.localStorage.removeItem(rememberedEmailStorageKey);
    window.localStorage.removeItem(rememberStorageKey);
  }

  window.localStorage.removeItem(legacyRememberedPasswordStorageKey);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(() => getStoredValue(rememberedEmailStorageKey));
  const [password, setPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(() => getStoredRememberLogin());
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canLogin =
    email.trim().length > 0 && password.trim().length > 0 && !isSubmitting;

  useEffect(() => {
    const authenticated =
      window.localStorage.getItem(authStorageKey) === "true" ||
      window.sessionStorage.getItem(authStorageKey) === "true";

    if (authenticated) {
      router.replace("/main");
    }
  }, [router]);

  const submitLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[A-Za-z0-9._%+-]+@gsm\.hs\.kr$/.test(normalizedEmail)) {
      setLoginError("이메일 형식이 올바르지 않습니다.");
      return;
    }

    setIsSubmitting(true);
    setLoginError("");

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({ email: normalizedEmail, password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as LoginResponse | null;

      if (!response.ok || payload?.status === "error") {
        setLoginError(getResponseMessage(payload, "로그인에 실패했습니다."));
        return;
      }

      persistLogin(payload ?? { status: "success" }, rememberLogin, normalizedEmail);
      router.push("/main");
    } catch {
      setLoginError("로그인 서버에 연결할 수 없습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPage>
      <AuthCard>
        <h2 className="text-[34px] font-black tracking-[-0.04em]">로그인</h2>
        <p className="mt-3 text-[17px] font-medium text-[#7f8da3]">
          Rentrella 계정으로 우산 대여 서비스를 이용하세요.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (canLogin) void submitLogin();
          }}
        >
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
            onChange={(value) => {
              setPassword(value);
              if (loginError) setLoginError("");
            }}
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
              비밀번호 변경
            </Link>
          </div>

          <PrimaryButton
            disabled={!canLogin}
            onClick={() => {
              void submitLogin();
            }}
          >
            {isSubmitting ? "로그인 중" : "로그인 하기"}
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
