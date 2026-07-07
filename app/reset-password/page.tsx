import Link from "next/link";
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
            <Field icon={<MailIcon />} label="이메일" placeholder="example@email.com" type="email" />
            <button
              className="h-16 rounded-[19px] bg-[#6db6ed] px-7 text-[17px] font-black text-white shadow-[0_12px_22px_rgba(109,182,237,0.2)]"
              type="button"
            >
              인증코드 발송
            </button>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-end gap-4 max-sm:grid-cols-1">
            <Field icon={<KeyIcon />} label="인증코드" placeholder="6자리 숫자 입력" />
            <button
              className="h-16 rounded-[19px] bg-[#f2f6fa] px-10 text-[17px] font-black text-[#b8c2cf]"
              type="button"
            >
              확인
            </button>
          </div>

          <div className="h-px bg-[#e7eef5]" />

          <Field icon={<LockIcon />} label="새 비밀번호" placeholder="8자 이상 입력" type="password" />
          <Field icon={<LockIcon />} label="새 비밀번호 확인" placeholder="새 비밀번호 다시 입력" type="password" />

          <PrimaryButton>비밀번호 변경하기</PrimaryButton>
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
