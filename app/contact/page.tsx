import Link from "next/link";

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
    >
      <path
        d="M10 4c-3.1 0-5.6 2-5.6 4.6 0 1.5.8 2.8 2 3.6l-.6 2.5 2.7-1.5c.5.1.9.2 1.5.2 3.1 0 5.6-2 5.6-4.8S13.1 4 10 4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f9fc] text-[#111728]">
      <header className="border-b border-[#e2ebf3] bg-white">
        <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-8">
          <Link className="text-[28px] font-black tracking-[-0.03em]" href="/">
            Rentrella
          </Link>
          <Link
            className="rounded-full border border-[#dce6ef] bg-white px-5 py-3 text-[15px] font-black text-[#59677d]"
            href="/"
          >
            홈으로
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl px-8 py-12">
        <div className="rounded-[31px] border border-[#e1e8f0] bg-white p-8 shadow-[0_18px_42px_rgba(35,49,72,0.06)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-[17px] bg-[#e7f5ff] text-[#5daeea]">
            <ChatIcon />
          </div>
          <h1 className="mt-6 text-[38px] font-black tracking-[-0.04em]">
            문의하기
          </h1>
          <p className="mt-3 text-[17px] font-medium leading-7 text-[#7a8797]">
            우산 대여, 반납, 서비스 이용 중 궁금한 내용을 남겨주세요.
          </p>

          <form className="mt-8 space-y-5">
            <label className="block">
              <span className="text-[15px] font-black text-[#59677d]">이름</span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-[#dce6ef] bg-[#f9fbfd] px-4 text-[15px] font-medium outline-none focus:border-[#6db6ed]"
                placeholder="이름을 입력하세요"
              />
            </label>
            <label className="block">
              <span className="text-[15px] font-black text-[#59677d]">
                연락처
              </span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-[#dce6ef] bg-[#f9fbfd] px-4 text-[15px] font-medium outline-none focus:border-[#6db6ed]"
                placeholder="이메일 또는 전화번호"
              />
            </label>
            <label className="block">
              <span className="text-[15px] font-black text-[#59677d]">
                문의 내용
              </span>
              <textarea
                className="mt-2 min-h-36 w-full resize-none rounded-2xl border border-[#dce6ef] bg-[#f9fbfd] px-4 py-4 text-[15px] font-medium outline-none focus:border-[#6db6ed]"
                placeholder="문의 내용을 입력하세요"
              />
            </label>
            <button
              className="h-13 w-full rounded-2xl bg-[#6db6ed] px-6 py-4 text-[17px] font-black text-white shadow-[0_9px_16px_rgba(109,182,237,0.22)]"
              type="button"
            >
              문의 보내기
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
