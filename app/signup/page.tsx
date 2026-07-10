"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

const temporaryVerificationCode = "123456";

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

function isErrorResponse(payload: unknown) {
  if (!isRecord(payload)) {
    return false;
  }

  const { error, status } = payload;

  return (
    (typeof status === "string" && status.toLowerCase() === "error") ||
    (typeof status === "number" && status >= 400) ||
    payload.ok === false ||
    payload.success === false ||
    error === true ||
    (typeof error === "string" && error.trim().length > 0)
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeMessage, setCodeMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [hasPrivacyAgreed, setHasPrivacyAgreed] = useState(false);
  const [hasSentCode, setHasSentCode] = useState(false);
  const [hasVerifiedCode, setHasVerifiedCode] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);
  const normalizedEmail = email.trim().toLowerCase();
  const isSchoolEmail = /^[A-Za-z0-9._%+-]+@gsm\.hs\.kr$/.test(normalizedEmail);
  const passwordStrength = getPasswordStrength(password);
  const canSendCode = email.trim().length > 0;
  const canConfirmCode = code.trim().length > 0;
  const canSignup =
    email.trim().length > 0 &&
    hasVerifiedCode &&
    password.trim().length > 0 &&
    passwordConfirm.trim().length > 0 &&
    hasPrivacyAgreed &&
    !isSubmitting;

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
    setSignupError("");
    setCodeMessage(null);
    setHasVerifiedCode(false);
    setHasSentCode(true);
    setCodeTimer(180);
  };

  const confirmCode = () => {
    if (code === temporaryVerificationCode) {
      setCodeMessage({
        tone: "success",
        text: "인증코드 확인이 완료되었습니다.",
      });
      setHasVerifiedCode(true);
      setHasSentCode(false);
      setCodeTimer(0);
      return;
    }

    setCodeMessage({
      tone: "error",
      text: "인증코드가 올바르지 않습니다.",
    });
    setHasVerifiedCode(false);
  };

  const submitSignup = async () => {
    if (!isSchoolEmail) {
      setEmailError("이메일 형식이 올바르지 않아요.");
      return;
    }

    if (!hasVerifiedCode) {
      setSignupError("이메일 인증을 완료해 주세요.");
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
    setSignupError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        body: JSON.stringify({ email: normalizedEmail, password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as unknown;

      if (!response.ok || isErrorResponse(payload)) {
        setSignupError(getResponseMessage(payload, "회원가입에 실패했습니다."));
        return;
      }

      router.push("/login");
    } catch {
      setSignupError("회원가입 서버에 연결할 수 없습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPrivacyModal = () => {
    if (hasPrivacyAgreed) {
      setHasPrivacyAgreed(false);
      return;
    }

    setHasReadPrivacy(false);
    setIsPrivacyModalOpen(true);
  };

  const confirmPrivacyAgreement = () => {
    if (!hasReadPrivacy) return;

    setHasPrivacyAgreed(true);
    setIsPrivacyModalOpen(false);
  };

  return (
    <AuthPage>
      <AuthCard>
        <h2 className="text-[34px] font-black tracking-[-0.04em]">회원가입</h2>

        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSignup) void submitSignup();
          }}
        >
          <div className="grid grid-cols-[1fr_auto] items-end gap-4 max-sm:grid-cols-1">
            <Field
              icon={<MailIcon />}
              label="이메일"
              onChange={(value) => {
                setEmail(value);
                setHasVerifiedCode(false);
                setCodeMessage(null);
                if (emailError) setEmailError("");
                if (signupError) setSignupError("");
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
              {hasSentCode ? "재발송" : "인증코드 발송"}
            </button>
          </div>
          {emailError && (
            <p className="-mt-2 text-[14px] font-bold text-[#ef5f67]">
              {emailError}
            </p>
          )}
          <div className="grid grid-cols-[1fr_auto] items-end gap-4 max-sm:grid-cols-1">
            <Field
              icon={<KeyIcon />}
              inputMode="numeric"
              label="인증코드"
              maxLength={6}
              onChange={(value) => {
                setCode(value.replace(/\D/g, "").slice(0, 6));
                setCodeMessage(null);
                setHasVerifiedCode(false);
                if (signupError) setSignupError("");
              }}
              pattern="[0-9]*"
              placeholder="6자리 숫자 입력"
              value={code}
            />
            <div className="flex items-end gap-3">
              {codeTimer > 0 && (
                <span className="flex h-[74px] min-w-20 items-center justify-center rounded-[22px] bg-[#f2f6fa] px-5 text-[18px] font-black text-[#7f8da3]">
                  {formatTimer(codeTimer)}
                </span>
              )}
              <button
                className={[
                  "h-[74px] rounded-[22px] px-12 text-[18px] font-black",
                  canConfirmCode
                    ? "bg-[#6db6ed] text-white shadow-[0_12px_22px_rgba(109,182,237,0.2)]"
                    : "cursor-not-allowed bg-[#edf2f7] text-[#aeb9c8]",
                ].join(" ")}
                disabled={!canConfirmCode}
                onClick={confirmCode}
                type="button"
              >
                확인
              </button>
            </div>
          </div>
          {hasSentCode && codeTimer === 0 && (
            <div className="-mt-4 flex justify-end">
              <button
                className={[
                  "text-[14px] font-black",
                  email.trim().length > 0
                    ? "cursor-pointer text-[#5daeea]"
                    : "cursor-not-allowed text-[#b8c2cf]",
                ].join(" ")}
                disabled={email.trim().length === 0}
                onClick={sendCode}
                type="button"
              >
                재발송
              </button>
            </div>
          )}
          {codeMessage && (
            <p
              className={[
                "-mt-2 rounded-[16px] px-5 py-3 text-[14px] font-black",
                codeMessage.tone === "success"
                  ? "bg-[#e8f8ee] text-[#2fa461]"
                  : "bg-[#fff0f1] text-[#ef5f67]",
              ].join(" ")}
            >
              {codeMessage.text}
            </p>
          )}
          <Field
            icon={<LockIcon />}
            label="비밀번호"
            onChange={(value) => {
              setPassword(value);
              if (passwordError) setPasswordError("");
              if (signupError) setSignupError("");
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
            onChange={(value) => {
              setPasswordConfirm(value);
              if (passwordError) setPasswordError("");
              if (signupError) setSignupError("");
            }}
            placeholder="비밀번호 다시 입력"
            type="password"
            value={passwordConfirm}
          />
          {signupError && (
            <p
              aria-live="polite"
              className="-mt-2 text-[14px] font-bold text-[#ef5f67]"
            >
              {signupError}
            </p>
          )}

          <button
            className="flex w-full items-center gap-3 text-left text-[16px] font-black text-[#7f8da3]"
            onClick={openPrivacyModal}
            type="button"
          >
            <span
              className={[
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] border-2",
                hasPrivacyAgreed
                  ? "border-[#6db6ed] bg-[#e3f1ff] text-[#6db6ed]"
                  : "border-[#d5e2ef] bg-[#f1f5fa] text-transparent",
              ].join(" ")}
            >
              ✓
            </span>
            <span>
              개인정보 수집 및 이용에 동의
            </span>
          </button>

          <PrimaryButton
            disabled={!canSignup}
            onClick={() => {
              void submitSignup();
            }}
          >
            {isSubmitting ? "회원가입 중" : "회원가입 하기"}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-[16px] font-medium text-[#9aa5b3]">
          이미 계정이 있나요?{" "}
          <Link className="font-black text-[#5daeea]" href="/login">
            로그인
          </Link>
        </p>
      </AuthCard>

      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111728]/35 px-5 py-8 backdrop-blur-sm">
          <section className="flex max-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col rounded-[32px] border border-[#d5ecff] bg-white p-7 shadow-[0_24px_70px_rgba(17,23,40,0.22)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[15px] font-black text-[#5daeea]">Rentrella</p>
                <h3 className="mt-2 text-[30px] font-black tracking-[-0.04em]">
                  개인정보 수집 및 이용 동의
                </h3>
                <p className="mt-2 text-[15px] font-bold text-[#8c99ab]">
                  내용을 끝까지 확인해야 동의 버튼을 누를 수 있습니다.
                </p>
              </div>
              <button
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2f6fa] text-[22px] font-black text-[#7a8797]"
                onClick={() => setIsPrivacyModalOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div
              className="mt-6 max-h-[380px] overflow-y-auto rounded-[22px] bg-[#f7fbff] px-6 py-5 text-[15px] font-semibold leading-7 text-[#59677d]"
              onScroll={(event) => {
                const target = event.currentTarget;
                const isBottom =
                  target.scrollTop + target.clientHeight >= target.scrollHeight - 8;

                if (isBottom) {
                  setHasReadPrivacy(true);
                }
              }}
            >
              <p className="font-black text-[#111728]">1. 수집하는 개인정보 항목</p>
              <p className="mt-2">
                Rentrella는 회원가입 및 우산 대여 서비스 제공을 위해 학교 이메일,
                비밀번호, 서비스 이용 기록, 우산 대여 및 반납 기록을 수집합니다.
              </p>

              <p className="mt-6 font-black text-[#111728]">2. 개인정보 수집 목적</p>
              <p className="mt-2">
                수집된 정보는 회원 식별, 학교 구성원 확인, 우산 대여 가능 여부 확인,
                반납 관리, 연체 상태 안내, 문의 응대 목적으로만 사용됩니다.
              </p>

              <p className="mt-6 font-black text-[#111728]">3. 보관 및 이용 기간</p>
              <p className="mt-2">
                회원 정보는 서비스 이용 기간 동안 보관되며, 회원 탈퇴 또는 서비스
                이용 종료 요청 시 지체 없이 삭제됩니다. 단, 대여 및 반납 기록은
                분쟁 방지와 운영 기록 확인을 위해 필요한 기간 동안 보관될 수 있습니다.
              </p>

              <p className="mt-6 font-black text-[#111728]">4. 동의 거부 권리</p>
              <p className="mt-2">
                사용자는 개인정보 수집 및 이용에 동의하지 않을 수 있습니다. 다만,
                필수 정보 수집에 동의하지 않을 경우 Rentrella 회원가입 및 우산 대여
                서비스를 이용할 수 없습니다.
              </p>

              <p className="mt-6 font-black text-[#111728]">5. 개인정보 보호</p>
              <p className="mt-2">
                Rentrella는 수집된 개인정보가 외부에 임의로 공개되지 않도록 관리하며,
                서비스 운영 목적 외의 용도로 사용하지 않습니다. 개인정보 접근은 서비스
                운영에 필요한 범위로 제한됩니다.
              </p>

              <p className="mt-6 font-black text-[#111728]">6. 문의</p>
              <p className="mt-2">
                개인정보 처리와 관련된 문의는 서비스 내 문의하기 기능을 통해 접수할 수
                있습니다. 접수된 문의는 확인 후 필요한 안내를 제공합니다.
              </p>
            </div>

            <button
              className={[
                "mt-6 h-14 rounded-[18px] text-[18px] font-black",
                hasReadPrivacy
                  ? "bg-[#6db6ed] text-white shadow-[0_12px_22px_rgba(109,182,237,0.24)]"
                  : "cursor-not-allowed bg-[#edf2f7] text-[#aeb9c8]",
              ].join(" ")}
              disabled={!hasReadPrivacy}
              onClick={confirmPrivacyAgreement}
              type="button"
            >
              확인했습니다
            </button>
          </section>
        </div>
      )}
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
