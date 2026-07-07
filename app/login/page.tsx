import Link from "next/link";
import {
  AuthCard,
  AuthPage,
  Field,
  LockIcon,
  MailIcon,
  PrimaryButton,
  UmbrellaIcon,
} from "../auth/AuthShell";

export default function LoginPage() {
  return (
    <AuthPage
      badge="로그인"
      description="학교에서 필요한 우산을 빠르게 확인하고 대여하세요."
      icon={<UmbrellaIcon />}
      title={"다시 만나서\n반가워요"}
    >
      <AuthCard>
        <h2 className="text-[34px] font-black tracking-[-0.04em]">로그인</h2>
        <p className="mt-3 text-[17px] font-medium text-[#7f8da3]">
          Rentrella 계정으로 우산 대여 서비스를 이용하세요.
        </p>

        <form className="mt-8 space-y-5">
          <Field icon={<MailIcon />} label="이메일" placeholder="student@gsm.hs.kr" type="email" />
          <Field icon={<LockIcon />} label="비밀번호" placeholder="비밀번호 입력" type="password" />

          <div className="flex items-center justify-between text-[15px] font-bold">
            <label className="flex items-center gap-2 text-[#8c99ab]">
              <input className="h-4 w-4 accent-[#6db6ed]" type="checkbox" />
              로그인 유지
            </label>
            <Link className="text-[#5daeea]" href="/reset-password">
              비밀번호 찾기
            </Link>
          </div>

          <PrimaryButton href="/main">로그인 하기</PrimaryButton>
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
