import Link from "next/link";
import type { ReactNode } from "react";

export function AuthLogo() {
  return (
    <Link className="inline-flex items-center gap-4" href="/">
      <span className="flex h-14 w-14 items-center justify-center rounded-[17px] bg-[#6db6ed] text-white shadow-[0_12px_24px_rgba(109,182,237,0.22)]">
        <UmbrellaIcon />
      </span>
      <span>
        <span className="block text-[32px] font-black leading-none tracking-[-0.03em] text-[#111728]">
          Rentrella
        </span>
        <span className="mt-1 block text-[17px] font-medium leading-none text-[#9aa5b3]">
          우산 대여 서비스
        </span>
      </span>
    </Link>
  );
}

export function AuthPage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7fbff] px-6 py-8 text-[#111728]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col">
        <div className="flex justify-start">
          <AuthLogo />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-3xl">{children}</div>
        </div>
      </section>
    </main>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <section className="w-full rounded-[36px] border border-[#d5ecff] bg-white p-8 shadow-[0_24px_70px_rgba(33,75,120,0.08)] max-sm:p-6">
      {children}
    </section>
  );
}

export function Field({
  icon,
  label,
  placeholder,
  type = "text",
}: {
  icon: ReactNode;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[15px] font-black text-[#7f8da3]">{label}</span>
      <span className="mt-3 flex h-16 items-center gap-4 rounded-[19px] bg-[#f1f5fa] px-5 text-[#9aa8bb]">
        <span className="text-[#6db6ed]">{icon}</span>
        <input
          className="min-w-0 flex-1 bg-transparent text-[18px] font-semibold text-[#111728] outline-none placeholder:text-[#9aa8bb]"
          placeholder={placeholder}
          type={type}
        />
      </span>
    </label>
  );
}

export function PrimaryButton({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}) {
  const className =
    "flex h-16 w-full items-center justify-center rounded-[20px] bg-[#6db6ed] text-[20px] font-black text-white shadow-[0_14px_24px_rgba(109,182,237,0.28)]";

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type="button">
      {children}
    </button>
  );
}

export function UmbrellaIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="30" viewBox="0 0 28 28" width="30">
      <path
        d="M5.8 13.1C6.6 8.8 9.8 6.2 14 6.2s7.4 2.6 8.2 6.9H5.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.35"
      />
      <path
        d="M14 13.1v6.3c0 1.6 1.1 2.6 2.5 2.6 1.2 0 2.1-.8 2.4-1.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.35"
      />
      <path d="M14 6.2V3.9" stroke="currentColor" strokeLinecap="round" strokeWidth="2.35" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 24 24" width="26">
      <path
        d="M4.8 6.8h14.4v10.4H4.8V6.8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="m5.5 7.5 6.5 5 6.5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="28" viewBox="0 0 24 24" width="28">
      <path
        d="M7 10V8.2C7 5.3 9.1 3.4 12 3.4s5 1.9 5 4.8V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M6.2 10h11.6c.8 0 1.4.6 1.4 1.4v6.8c0 .8-.6 1.4-1.4 1.4H6.2c-.8 0-1.4-.6-1.4-1.4v-6.8c0-.8.6-1.4 1.4-1.4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="28" viewBox="0 0 24 24" width="28">
      <path
        d="M12 12.2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4.8 20.4c.8-3.6 3.5-5.6 7.2-5.6s6.4 2 7.2 5.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function KeyIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="28" viewBox="0 0 24 24" width="28">
      <path
        d="M8.8 14.1a4.2 4.2 0 1 1 3.1 3.1L9 20.1H6.2v-2.8l2.6-3.2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M15.6 8.4h.1" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}
