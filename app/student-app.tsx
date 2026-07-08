"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Lock,
  LockOpen,
  MessageSquare,
  RefreshCcw,
  ShieldCheck,
  Umbrella,
  Users,
} from "lucide-react";

type FlowState = "ready" | "rentUnlock" | "rented" | "returnUnlock";

type Student = {
  id: string;
  name: string;
  className: string;
  status: "대여 가능" | "대여 중" | "잠금";
};

const fixedUmbrellaCount = 12;

const students: Student[] = [
  { id: "S-2401", name: "김민서", className: "2학년 3반", status: "대여 가능" },
  { id: "S-2418", name: "박지훈", className: "1학년 1반", status: "대여 중" },
  { id: "S-2520", name: "이서연", className: "3학년 2반", status: "대여 가능" },
  { id: "S-2604", name: "최도윤", className: "2학년 5반", status: "잠금" },
];

const initialEvents = [
  { time: "09:40", label: "김민서 학생 인증 완료" },
  { time: "09:28", label: "박지훈 반납 요청 접수" },
  { time: "08:55", label: "관리자 전체 잠금 해제" },
];

function statusTone(status: Student["status"]) {
  if (status === "잠금") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (status === "대여 중") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function nowLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export default function StudentApp() {
  const [flow, setFlow] = useState<FlowState>("ready");
  const [selectedId, setSelectedId] = useState(students[0].id);
  const [events, setEvents] = useState(initialEvents);
  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedId) ?? students[0],
    [selectedId],
  );
  const isLocked = selectedStudent.status === "잠금";
  const hasUmbrella = flow === "rented" || flow === "returnUnlock";

  const addEvent = (label: string) => {
    setEvents((current) => [{ time: nowLabel(), label }, ...current].slice(0, 5));
  };

  const requestRental = () => {
    if (isLocked) {
      addEvent(`${selectedStudent.name} 학생 잠금으로 대여 차단`);
      return;
    }

    setFlow("rentUnlock");
    addEvent(`${selectedStudent.name} 대여 요청 승인`);
  };

  const confirmPickup = () => {
    setFlow("rented");
    addEvent(`${selectedStudent.name} 우산 수령 확인`);
  };

  const requestReturn = () => {
    setFlow("returnUnlock");
    addEvent(`${selectedStudent.name} 반납 요청 승인`);
  };

  const confirmReturn = () => {
    setFlow("ready");
    addEvent(`${selectedStudent.name} 반납 완료`);
  };

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
              <Umbrella size={24} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">Rentrella</p>
              <p className="truncate text-xs font-semibold text-neutral-500">
                학생 우산 대여
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
            >
              <ShieldCheck size={16} aria-hidden="true" />
              관리자
            </Link>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 shadow-sm transition hover:bg-sky-50"
              aria-label="알림"
            >
              <Bell size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <section className="min-w-0 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-700">
                2026년 7월 7일
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-normal sm:text-3xl">
                대여와 반납 상태 관리
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                보관함은 학생 요청 상태를 확인한 뒤 선택 슬롯만 잠금 해제합니다.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:min-w-[160px]">
              <PolicyChip label="대여 가능" value={`${fixedUmbrellaCount}개`} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.84fr_1.16fr]">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-500">
                    학생 인증
                  </p>
                  <p className="mt-1 text-xl font-bold">{selectedStudent.name}</p>
                </div>
                <span
                  className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${statusTone(
                    selectedStudent.status,
                  )}`}
                >
                  {selectedStudent.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {students.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(student.id);
                      setFlow(student.status === "대여 중" ? "rented" : "ready");
                    }}
                    className={
                      selectedId === student.id
                        ? "flex w-full items-center justify-between gap-3 rounded-md border border-emerald-300 bg-white px-3 py-3 text-left shadow-sm"
                        : "flex w-full items-center justify-between gap-3 rounded-md border border-transparent px-3 py-3 text-left transition hover:border-neutral-200 hover:bg-white"
                    }
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-neutral-950">
                        {student.name}
                      </span>
                      <span className="block truncate text-xs font-semibold text-neutral-500">
                        {student.className} · {student.id}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-md border px-2 py-1 text-xs font-bold ${statusTone(
                        student.status,
                      )}`}
                    >
                      {student.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-500">
                    현재 처리 상태
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    {flow === "ready" && "대여 요청 대기"}
                    {flow === "rentUnlock" && "04번 슬롯 대여 잠금 해제"}
                    {flow === "rented" && "대여 중"}
                    {flow === "returnUnlock" && "04번 슬롯 반납 잠금 해제"}
                  </h2>
                </div>
                <div className="flex size-11 items-center justify-center rounded-md bg-indigo-600 text-white">
                  {hasUmbrella ? (
                    <Umbrella size={21} aria-hidden="true" />
                  ) : (
                    <Lock size={21} aria-hidden="true" />
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <FlowStep
                  active={flow === "ready"}
                  icon={<MessageSquare size={18} aria-hidden="true" />}
                  label="요청 접수"
                />
                <FlowStep
                  active={flow === "rentUnlock" || flow === "returnUnlock"}
                  icon={<LockOpen size={18} aria-hidden="true" />}
                  label="잠금 해제"
                />
                <FlowStep
                  active={flow === "rented"}
                  icon={<CheckCircle2 size={18} aria-hidden="true" />}
                  label="상태 기록"
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {flow === "ready" && (
                  <ActionButton
                    icon={<Umbrella size={18} aria-hidden="true" />}
                    label={isLocked ? "학생 잠금 상태" : "대여 요청"}
                    disabled={isLocked}
                    onClick={requestRental}
                  />
                )}
                {flow === "rentUnlock" && (
                  <ActionButton
                    icon={<CheckCircle2 size={18} aria-hidden="true" />}
                    label="우산 수령 확인"
                    onClick={confirmPickup}
                  />
                )}
                {flow === "rented" && (
                  <ActionButton
                    icon={<RefreshCcw size={18} aria-hidden="true" />}
                    label="반납 요청"
                    onClick={requestReturn}
                  />
                )}
                {flow === "returnUnlock" && (
                  <ActionButton
                    icon={<CheckCircle2 size={18} aria-hidden="true" />}
                    label="보관함 반납 확인"
                    onClick={confirmReturn}
                  />
                )}
                <button
                  type="button"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-700 transition hover:bg-sky-50"
                  onClick={() => addEvent(`${selectedStudent.name} 문의 전송`)}
                >
                  <MessageSquare size={18} aria-hidden="true" />
                  문의 전송
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="min-w-0 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-neutral-500">보관함</p>
              <h2 className="mt-1 text-xl font-bold">12개 슬롯 고정</h2>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
              운영 중
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {Array.from({ length: fixedUmbrellaCount }, (_, index) => {
              const slot = index + 1;
              const activeSlot = slot === 4;
              const unlocked =
                activeSlot && (flow === "rentUnlock" || flow === "returnUnlock");
              const rented = activeSlot && flow === "rented";

              return (
                <div
                  key={slot}
                  className={
                    unlocked
                      ? "flex aspect-[1.1] flex-col items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700"
                      : rented
                        ? "flex aspect-[1.1] flex-col items-center justify-center rounded-md border border-amber-300 bg-amber-50 text-amber-700"
                        : "flex aspect-[1.1] flex-col items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-500"
                  }
                >
                  {unlocked ? (
                    <LockOpen size={20} aria-hidden="true" />
                  ) : (
                    <Lock size={20} aria-hidden="true" />
                  )}
                  <span className="mt-2 font-mono text-sm font-bold">
                    {String(slot).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MetricCard icon={<Users size={18} />} label="대여 학생" value={hasUmbrella ? "1명" : "0명"} />
            <MetricCard icon={<CalendarClock size={18} />} label="대여 기간" value={hasUmbrella ? "당일" : "-"} />
            <MetricCard icon={<Clock3 size={18} />} label="미반납" value="0건" />
          </div>

          <div className="mt-5 rounded-lg border border-neutral-200">
            <div className="border-b border-neutral-200 px-4 py-3">
              <p className="text-sm font-bold">최근 로그</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {events.map((event) => (
                <div key={`${event.time}-${event.label}`} className="flex gap-3 px-4 py-3">
                  <span className="w-12 shrink-0 font-mono text-xs font-bold text-neutral-500">
                    {event.time}
                  </span>
                  <span className="text-sm font-semibold text-neutral-700">
                    {event.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PolicyChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3 text-center">
      <p className="text-xs font-bold text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-black text-neutral-950">{value}</p>
    </div>
  );
}

function FlowStep({
  active,
  icon,
  label,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className={
        active
          ? "flex min-h-16 items-center gap-3 rounded-md border border-indigo-200 bg-indigo-50 px-3 text-indigo-700"
          : "flex min-h-16 items-center gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 text-neutral-500"
      }
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white">
        {icon}
      </span>
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}

function ActionButton({
  disabled,
  icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-sky-500 px-4 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-sky-100 disabled:text-sky-700"
    >
      {icon}
      {label}
    </button>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex items-center gap-2 text-neutral-500">{icon}</div>
      <p className="mt-2 text-xs font-bold text-neutral-500">{label}</p>
      <p className="mt-1 font-mono text-lg font-black text-neutral-950">
        {value}
      </p>
    </div>
  );
}
