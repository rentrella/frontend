import Link from "next/link";
import {
  AuthCard,
  AuthPage,
  Field,
  LockIcon,
  MailIcon,
  PrimaryButton,
  UserIcon,
} from "../auth/AuthShell";

export default function SignupPage() {
  return (
    <AuthPage>
      <AuthCard>
        <h2 className="text-[34px] font-black tracking-[-0.04em]">회원가입</h2>

        <form className="mt-8 space-y-5">
          <Field icon={<UserIcon />} label="이름" placeholder="홍길동" />
          <Field
            icon={<MailIcon />}
            label="이메일"
            pattern="^[A-Za-z0-9._%+-]+@gsm\.hs\.kr$"
            placeholder="student@gsm.hs.kr"
            title="@gsm.hs.kr 이메일만 사용할 수 있습니다."
            type="email"
          />
          <Field icon={<LockIcon />} label="비밀번호" placeholder="8자 이상 입력" type="password" />
          <Field icon={<LockIcon />} label="비밀번호 확인" placeholder="비밀번호 다시 입력" type="password" />

          <label className="flex items-center gap-3 text-[15px] font-bold text-[#8c99ab]">
            <input className="h-5 w-5 accent-[#6db6ed]" type="checkbox" />
            <span>
              <span className="text-[#5daeea]">서비스 이용약관</span> 및{" "}
              <span className="text-[#5daeea]">개인정보 처리방침</span>에 동의
            </span>
          </label>

          <PrimaryButton>회원가입 하기</PrimaryButton>
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
