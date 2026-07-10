"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarClock,
  History,
  Inbox,
  LayoutDashboard,
  Lock,
  LockOpen,
  RefreshCw,
  Send,
  ShieldCheck,
  Umbrella,
  UserLock,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type RentalStudent = {
  id: string;
  userId: number | null;
  name: string;
  className: string;
  borrowedCount: number;
  deviceId: number | null;
  umbrella: string;
  rentalPeriod: string;
  unreturnedPeriod: string;
  status: "대여 중" | "미반납" | "정상 반납" | "잠금";
};

type SentMessage = {
  time: string;
  target: string;
  body: string;
  status: "전송됨" | "예약";
};

type Inquiry = {
  id: string;
  name: string;
  time: string;
  title: string;
  state: "답변 필요" | "확인 중" | "완료";
};

type NavItem = {
  label: string;
  icon: LucideIcon;
};

type Stat = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
  iconTone: string;
};

type UmbrellaLogStatus = "BORROW" | "RETURN";

type UmbrellaLog = {
  logId: number;
  userId: number;
  deviceId: number;
  status: UmbrellaLogStatus;
  createdAt: string;
};

type ApiCommandResponse = {
  status?: string;
  msg?: string;
  message?: string;
};

const fixedUmbrellaCount = 12;

const fallbackRentalStudents: RentalStudent[] = [
  {
    id: "S-2401",
    userId: 1,
    name: "김민서",
    className: "2학년 3반",
    borrowedCount: 6,
    deviceId: 4,
    umbrella: "04번",
    rentalPeriod: "07.07 09:42 - 진행 중",
    unreturnedPeriod: "0시간 26분",
    status: "대여 중",
  },
  {
    id: "S-2418",
    userId: 2,
    name: "박지훈",
    className: "1학년 1반",
    borrowedCount: 9,
    deviceId: 8,
    umbrella: "08번",
    rentalPeriod: "07.06 16:20 - 진행 중",
    unreturnedPeriod: "17시간 48분",
    status: "미반납",
  },
  {
    id: "S-2520",
    userId: 3,
    name: "이서연",
    className: "3학년 2반",
    borrowedCount: 3,
    deviceId: 2,
    umbrella: "02번",
    rentalPeriod: "07.07 08:10 - 07.07 08:54",
    unreturnedPeriod: "-",
    status: "정상 반납",
  },
  {
    id: "S-2604",
    userId: 4,
    name: "최도윤",
    className: "2학년 5반",
    borrowedCount: 2,
    deviceId: null,
    umbrella: "-",
    rentalPeriod: "-",
    unreturnedPeriod: "-",
    status: "잠금",
  },
];

const inquiryCompleteMessage =
  "문의가 처리 완료되었습니다. 추가 도움이 필요하면 다시 문의해 주세요.";

const initialInquiries: Inquiry[] = [
  {
    id: "Q-103",
    name: "박지훈",
    time: "오늘 09:52",
    title: "반납함이 잠겨 있습니다",
    state: "답변 필요",
  },
  {
    id: "Q-102",
    name: "김민서",
    time: "오늘 09:33",
    title: "04번 슬롯에서 알림음이 납니다",
    state: "확인 중",
  },
  {
    id: "Q-101",
    name: "이서연",
    time: "어제 17:11",
    title: "우산 손잡이가 느슨합니다",
    state: "완료",
  },
];

const initialMessages: SentMessage[] = [
  {
    time: "09:58",
    target: "박지훈",
    body: "미반납 시간이 길어지고 있습니다. 반납 요청을 진행해 주세요.",
    status: "전송됨",
  },
  {
    time: "09:21",
    target: "전체 학생",
    body: "대여와 반납 요청은 학생 화면에서 진행해 주세요.",
    status: "전송됨",
  },
];

const primaryNav: NavItem[] = [
  { label: "대시보드", icon: LayoutDashboard },
  { label: "보안 관리", icon: ShieldCheck },
  { label: "대여 학생", icon: Users },
  { label: "문의 확인", icon: Inbox },
  { label: "로그 확인", icon: History },
];

const operationNav: NavItem[] = [
  { label: "전체 잠금", icon: Lock },
  { label: "학생 잠금", icon: UserLock },
  { label: "수동 메시지", icon: Send },
  { label: "하드웨어 점검", icon: Wrench },
];

function nowLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function statusTone(status: RentalStudent["status"]) {
  if (status === "미반납" || status === "잠금") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (status === "대여 중") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readList(payload: unknown, preferredKeys: string[]): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of preferredKeys) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value;
    }

    const nested = readList(value, preferredKeys);
    if (nested.length > 0) {
      return nested;
    }
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function readString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return null;
}

function readNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    const parsed =
      typeof value === "number"
        ? value
        : typeof value === "string" && value.trim().length > 0
          ? Number(value)
          : NaN;

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function readBoolean(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();

      if (normalized === "true" || normalized === "locked") {
        return true;
      }

      if (normalized === "false" || normalized === "unlocked") {
        return false;
      }
    }
  }

  return false;
}

function formatDeviceLabel(deviceId: number | null) {
  return deviceId === null ? "-" : `${String(deviceId).padStart(2, "0")}번`;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(date);
}

function formatDurationFrom(value: string | null) {
  if (!value) {
    return "-";
  }

  const start = new Date(value).getTime();

  if (Number.isNaN(start)) {
    return "-";
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - start) / 60000));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

function formatRentalPeriod(
  startedAt: string | null,
  returnedAt: string | null,
  status: RentalStudent["status"],
) {
  if (!startedAt) {
    return "-";
  }

  const startLabel = formatDateTime(startedAt);

  if (status === "대여 중" || status === "미반납") {
    return `${startLabel} - 진행 중`;
  }

  if (returnedAt) {
    return `${startLabel} - ${formatDateTime(returnedAt)}`;
  }

  return startLabel;
}

function normalizeStudentStatus(
  rawStatus: string | null,
  latestLogStatus: UmbrellaLogStatus | null,
  locked: boolean,
): RentalStudent["status"] {
  if (locked) {
    return "잠금";
  }

  const normalized = rawStatus?.toUpperCase() ?? "";

  if (normalized.includes("OVERDUE") || rawStatus?.includes("미반납")) {
    return "미반납";
  }

  if (
    normalized.includes("BORROW") ||
    normalized.includes("RENT") ||
    rawStatus?.includes("대여")
  ) {
    return "대여 중";
  }

  if (normalized.includes("RETURN") || rawStatus?.includes("반납")) {
    return "정상 반납";
  }

  if (latestLogStatus === "BORROW") {
    return "대여 중";
  }

  if (latestLogStatus === "RETURN") {
    return "정상 반납";
  }

  return "정상 반납";
}

function formatClassName(record: Record<string, unknown>) {
  const className = readString(record, [
    "className",
    "class_name",
    "classroom",
    "roomName",
  ]);

  if (className) {
    return className;
  }

  const grade = readString(record, ["grade", "schoolGrade", "gradeNumber"]);
  const classNumber = readString(record, [
    "classNo",
    "classNumber",
    "room",
    "ban",
  ]);

  if (grade && classNumber) {
    return `${grade}학년 ${classNumber}반`;
  }

  return "-";
}

function toUmbrellaLog(value: unknown, index: number): UmbrellaLog | null {
  if (!isRecord(value)) {
    return null;
  }

  const userId = readNumber(value, ["userId", "user_id"]);
  const deviceId = readNumber(value, ["deviceId", "device_id", "umbrellaId"]);
  const rawStatus = readString(value, ["status", "type"]);
  const status =
    rawStatus?.toUpperCase() === "BORROW"
      ? "BORROW"
      : rawStatus?.toUpperCase() === "RETURN"
        ? "RETURN"
        : null;

  if (userId === null || deviceId === null || status === null) {
    return null;
  }

  return {
    createdAt:
      readString(value, ["createdAt", "created_at", "time", "timestamp"]) ??
      new Date().toISOString(),
    deviceId,
    logId: readNumber(value, ["logId", "log_id", "id"]) ?? index + 1,
    status,
    userId,
  };
}

function extractUmbrellaLogs(payload: unknown) {
  return readList(payload, ["logs", "umbrella", "data", "result", "content"])
    .map(toUmbrellaLog)
    .filter((log): log is UmbrellaLog => log !== null)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
}

function getLatestLogsByUser(logs: UmbrellaLog[]) {
  const latestByUser = new Map<number, UmbrellaLog>();

  for (const log of logs) {
    const previous = latestByUser.get(log.userId);

    if (
      !previous ||
      new Date(log.createdAt).getTime() > new Date(previous.createdAt).getTime()
    ) {
      latestByUser.set(log.userId, log);
    }
  }

  return latestByUser;
}

function getBorrowCountsByUser(logs: UmbrellaLog[]) {
  const counts = new Map<number, number>();

  for (const log of logs) {
    if (log.status === "BORROW") {
      counts.set(log.userId, (counts.get(log.userId) ?? 0) + 1);
    }
  }

  return counts;
}

function toRentalStudent(
  value: unknown,
  index: number,
  latestByUser: Map<number, UmbrellaLog>,
  borrowCounts: Map<number, number>,
): RentalStudent | null {
  if (!isRecord(value)) {
    return null;
  }

  const userId = readNumber(value, ["userId", "user_id", "id"]);
  const latestLog = userId === null ? null : latestByUser.get(userId) ?? null;
  const deviceId =
    readNumber(value, [
      "deviceId",
      "device_id",
      "umbrellaId",
      "umbrella_id",
      "slotId",
    ]) ??
    latestLog?.deviceId ??
    null;
  const status = normalizeStudentStatus(
    readString(value, ["status", "rentalStatus", "state"]),
    latestLog?.status ?? null,
    readBoolean(value, ["locked", "isLocked", "rentalBlocked", "banned"]),
  );
  const startedAt =
    readString(value, [
      "borrowedAt",
      "borrowed_at",
      "rentedAt",
      "rentalStartAt",
      "startAt",
    ]) ?? (latestLog?.status === "BORROW" ? latestLog.createdAt : null);
  const returnedAt = readString(value, [
    "returnedAt",
    "returned_at",
    "rentalEndAt",
    "endAt",
  ]);
  const studentCode =
    readString(value, [
      "studentId",
      "student_id",
      "studentNo",
      "studentNumber",
      "code",
    ]) ?? (userId === null ? `S-${index + 1}` : `U-${userId}`);

  return {
    borrowedCount:
      readNumber(value, [
        "borrowedCount",
        "borrowCount",
        "rentalCount",
        "useCount",
      ]) ??
      (userId === null ? 0 : borrowCounts.get(userId) ?? 0),
    className: formatClassName(value),
    deviceId,
    id: studentCode,
    name:
      readString(value, ["name", "studentName", "userName", "username"]) ??
      `사용자 ${userId ?? index + 1}`,
    rentalPeriod:
      readString(value, ["rentalPeriod", "borrowPeriod"]) ??
      formatRentalPeriod(startedAt, returnedAt, status),
    status,
    umbrella: formatDeviceLabel(deviceId),
    unreturnedPeriod:
      readString(value, ["unreturnedPeriod", "overduePeriod"]) ??
      (status === "대여 중" || status === "미반납"
        ? formatDurationFrom(startedAt)
        : "-"),
    userId,
  };
}

function extractStudents(payload: unknown, logs: UmbrellaLog[]) {
  const latestByUser = getLatestLogsByUser(logs);
  const borrowCounts = getBorrowCountsByUser(logs);

  return readList(payload, ["students", "users", "data", "result", "content"])
    .map((item, index) =>
      toRentalStudent(item, index, latestByUser, borrowCounts),
    )
    .filter((student): student is RentalStudent => student !== null);
}

function formatUmbrellaLog(log: UmbrellaLog) {
  const statusLabel = log.status === "BORROW" ? "대여" : "반납";

  return `${formatDateTime(log.createdAt)} 사용자 ${log.userId} · ${formatDeviceLabel(
    log.deviceId,
  )} 우산 ${statusLabel}`;
}

function getApiMessage(payload: unknown, fallback: string) {
  if (!isRecord(payload)) {
    return fallback;
  }

  const message = payload.msg ?? payload.message ?? payload.error;

  return typeof message === "string" && message.trim().length > 0
    ? message
    : fallback;
}

async function requestAdmin<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, init);
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json().catch(() => null)) as unknown)
    : await response.text();

  if (!response.ok) {
    throw new Error(getApiMessage(payload, `요청 실패 (${response.status})`));
  }

  return payload as T;
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm shadow-sky-200">
        <Umbrella size={24} strokeWidth={2.2} aria-hidden="true" />
      </div>
      <div>
        <p className="text-lg font-bold text-slate-950">Rentrella</p>
        <p className="text-xs font-medium text-slate-400">Umbrella Admin</p>
      </div>
    </div>
  );
}

function Sidebar({
  activeLabel,
  onNavSelect,
}: {
  activeLabel: string;
  onNavSelect: (label: string) => void;
}) {
  return (
    <aside className="hidden min-h-screen border-r border-slate-200 bg-white px-6 py-7 lg:block">
      <div className="sticky top-7">
        <Logo />

        <nav className="mt-12 space-y-8" aria-label="관리자 메뉴">
          <NavGroup
            activeLabel={activeLabel}
            title="운영"
            items={primaryNav}
            onNavSelect={onNavSelect}
          />
          <NavGroup
            activeLabel={activeLabel}
            title="제어"
            items={operationNav}
            onNavSelect={onNavSelect}
          />
        </nav>

        <div className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-white text-sky-600 shadow-sm">
              <ShieldCheck size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">보관함 상태</p>
              <p className="text-xs text-slate-500">총 12개 슬롯 고정</p>
            </div>
          </div>
          <div className="mt-4 h-2 rounded bg-white">
            <div className="h-2 w-full rounded bg-emerald-500" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavGroup({
  activeLabel,
  title,
  items,
  onNavSelect,
}: {
  activeLabel: string;
  title: string;
  items: NavItem[];
  onNavSelect: (label: string) => void;
}) {
  return (
    <div>
      <p className="px-3 text-xs font-semibold uppercase text-slate-400">
        {title}
      </p>
      <div className="mt-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeLabel === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavSelect(item.label)}
              className={
                active
                  ? "flex h-12 w-full items-center gap-3 rounded-lg bg-sky-100 px-4 text-left text-sm font-semibold text-sky-700"
                  : "flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-medium text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
              }
            >
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileHeader() {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Logo />
        <button
          className="flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-sky-50"
          type="button"
          aria-label="알림 보기"
        >
          <Bell size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <p className="mt-3 font-mono text-3xl font-semibold text-slate-950">
            {stat.value}
          </p>
        </div>
        <div
          className={`flex size-11 items-center justify-center rounded-lg ${stat.iconTone}`}
        >
          <Icon size={21} strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
      <div
        className={`mt-5 inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold ${stat.accent}`}
      >
        {stat.detail}
      </div>
    </article>
  );
}

function ToolbarButton({
  disabled,
  href,
  icon: Icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  href?: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) {
  const classes =
    "flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50";

  if (href) {
    return (
      <Link href={href} className={classes}>
        <Icon size={16} aria-hidden="true" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      className={`${classes} disabled:cursor-not-allowed disabled:opacity-60`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon size={16} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export default function AdminDashboard() {
  const allLocked = false;
  const [activeLabel, setActiveLabel] = useState(primaryNav[0].label);
  const [students, setStudents] = useState(fallbackRentalStudents);
  const [selectedId, setSelectedId] = useState(fallbackRentalStudents[0].id);
  const [studentLocks, setStudentLocks] = useState<Set<string>>(
    () =>
      new Set(
        fallbackRentalStudents
          .filter((student) => student.status === "잠금")
          .map((student) => student.id),
      ),
  );
  const [rentalLogs, setRentalLogs] = useState<UmbrellaLog[]>([]);
  const [localLogs, setLocalLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<
    "student-lock" | "umbrella-lock" | "open-slot" | null
  >(null);
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [messageText, setMessageText] = useState(
    "반납 예정 시간을 확인하고 반납 요청을 진행해 주세요.",
  );
  const [messages, setMessages] = useState(initialMessages);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const selectedStudent = useMemo(
    () =>
      students.find((student) => student.id === selectedId) ??
      students[0] ??
      null,
    [selectedId, students],
  );
  const selectedLocked =
    selectedStudent !== null &&
    (studentLocks.has(selectedStudent.id) || selectedStudent.status === "잠금");
  const manualMessageLabel = operationNav[2].label;
  const isManualMessageView = activeLabel === manualMessageLabel;
  const activeRentals = students.filter(
    (student) => student.status === "대여 중" || student.status === "미반납",
  ).length;
  const pendingInquiries = inquiries.filter(
    (inquiry) => inquiry.state !== "완료",
  ).length;
  const displayLogs = useMemo(
    () => [...localLogs, ...rentalLogs.map(formatUmbrellaLog)].slice(0, 10),
    [localLogs, rentalLogs],
  );

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    setApiError("");

    try {
      const [studentsPayload, logsPayload] = await Promise.all([
        requestAdmin<unknown>("/api/admin/students"),
        requestAdmin<unknown>("/api/admin/umbrella"),
      ]);
      const nextLogs = extractUmbrellaLogs(logsPayload);
      const nextStudents = extractStudents(studentsPayload, nextLogs);

      setRentalLogs(nextLogs);
      setStudents(nextStudents);
      setStudentLocks(
        new Set(
          nextStudents
            .filter((student) => student.status === "잠금")
            .map((student) => student.id),
        ),
      );
      setSelectedId((current) =>
        nextStudents.some((student) => student.id === current)
          ? current
          : nextStudents[0]?.id ?? "",
      );
      setApiMessage("백엔드 데이터 동기화 완료");
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "백엔드 데이터를 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadAdminData();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadAdminData]);

  const stats: Stat[] = [
    {
      label: "대여 가능 우산",
      value: `${fixedUmbrellaCount}`,
      detail: "고정 수량",
      icon: Umbrella,
      accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
      iconTone: "bg-emerald-500 text-white",
    },
    {
      label: "현재 대여 학생",
      value: `${activeRentals}`,
      detail: "진행 중",
      icon: Users,
      accent: "border-sky-200 bg-sky-50 text-sky-700",
      iconTone: "bg-sky-500 text-white",
    },
    {
      label: "확인할 문의",
      value: `${pendingInquiries}`,
      detail: "완료 버튼 처리",
      icon: Inbox,
      accent: "border-amber-200 bg-amber-50 text-amber-700",
      iconTone: "bg-amber-500 text-white",
    },
    {
      label: "잠금된 유저",
      value: `${studentLocks.size}`,
      detail: allLocked ? "전체 잠금 중" : "학생 단위",
      icon: Lock,
      accent: allLocked
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-slate-50 text-slate-700",
      iconTone: "bg-sky-500 text-white",
    },
  ];

  const pushLog = (label: string) => {
    setLocalLogs((current) => [`${nowLabel()} ${label}`, ...current].slice(0, 7));
  };

  const lockSelectedUser = async () => {
    if (!selectedStudent || selectedStudent.userId === null || selectedLocked) {
      return;
    }

    setPendingAction("student-lock");
    setApiError("");

    try {
      const result = await requestAdmin<ApiCommandResponse>(
        "/api/admin/lock/user",
        {
          body: JSON.stringify({ userId: selectedStudent.userId }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        },
      );

      setStudentLocks((current) => new Set(current).add(selectedStudent.id));
      setStudents((current) =>
        current.map((student) =>
          student.id === selectedStudent.id
            ? { ...student, status: "잠금" }
            : student,
        ),
      );
      setApiMessage(getApiMessage(result, "대여 금지 처리 완료"));
      pushLog(`${selectedStudent.name} 대여 금지 처리`);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "대여 금지 처리 실패",
      );
    } finally {
      setPendingAction(null);
    }
  };

  const lockSelectedUmbrella = async () => {
    if (!selectedStudent || selectedStudent.deviceId === null) {
      setApiError("선택된 학생의 우산 정보가 없습니다.");
      return;
    }

    setPendingAction("umbrella-lock");
    setApiError("");

    try {
      const result = await requestAdmin<ApiCommandResponse>(
        "/api/admin/lock/umbrella",
        {
          body: JSON.stringify({ deviceId: selectedStudent.deviceId }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        },
      );

      setApiMessage(getApiMessage(result, "우산 꽂이 잠금 완료"));
      pushLog(`${selectedStudent.umbrella} 우산 꽂이 잠금`);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "우산 꽂이 잠금 실패",
      );
    } finally {
      setPendingAction(null);
    }
  };

  const openSelectedSlot = async () => {
    if (!selectedStudent || selectedStudent.deviceId === null) {
      setApiError("선택된 학생의 우산 정보가 없습니다.");
      return;
    }

    setPendingAction("open-slot");
    setApiError("");

    try {
      const result = await requestAdmin<ApiCommandResponse>(
        `/api/admin/open?deviceId=${selectedStudent.deviceId}`,
        { method: "POST" },
      );

      setApiMessage(getApiMessage(result, "명령 접수됨"));
      pushLog(`${selectedStudent.umbrella} 슬롯 수동 열기`);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "슬롯 열기 실패");
    } finally {
      setPendingAction(null);
    }
  };

  const sendMessage = () => {
    const body = messageText.trim();

    if (!body || !selectedStudent) {
      return;
    }

    setMessages((current) => [
      {
        time: nowLabel(),
        target: selectedStudent.name,
        body,
        status: "전송됨",
      },
      ...current,
    ]);
    pushLog(`${selectedStudent.name}에게 수동 메시지 전송`);
  };

  const completeInquiry = (inquiry: Inquiry) => {
    setInquiries((current) =>
      current.map((item) =>
        item.id === inquiry.id ? { ...item, state: "완료" } : item,
      ),
    );
    setMessages((current) => [
      {
        time: nowLabel(),
        target: inquiry.name,
        body: inquiryCompleteMessage,
        status: "전송됨",
      },
      ...current,
    ]);
    pushLog(`${inquiry.name} 문의 완료 알림 전송`);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <MobileHeader />

      <div className="lg:grid lg:grid-cols-[264px_1fr]">
        <Sidebar activeLabel={activeLabel} onNavSelect={setActiveLabel} />

        <section className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-700">
                  실시간 운영 상태
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                  {isManualMessageView ? "수동 메시지" : "우산 대여 보안 관리 대시보드"}
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ToolbarButton
                  disabled={isLoading}
                  icon={RefreshCw}
                  label={isLoading ? "동기화 중" : "학생 동기화"}
                  onClick={loadAdminData}
                />
                <ToolbarButton href="/" label="학생 화면" icon={Umbrella} />
                <button
                  className="hidden size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-sky-50 lg:flex"
                  type="button"
                  aria-label="알림 보기"
                >
                  <Bell size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            {(apiError || apiMessage) && (
              <div
                className={
                  apiError
                    ? "mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"
                    : "mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
                }
              >
                {apiError || apiMessage}
              </div>
            )}

            {!isManualMessageView && (
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <StatCard key={stat.label} stat={stat} />
                ))}
              </div>
            )}

            <div className="mt-6 grid gap-6">
              {!isManualMessageView && (
                <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      보안 관리
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      하드웨어 수동 조절
                    </h2>
                  </div>
                  <span
                    className={
                      allLocked
                        ? "rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700"
                        : "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700"
                    }
                  >
                    {allLocked ? "전체 잠금" : "운영 중"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  <ControlButton
                    active={selectedLocked}
                    busy={pendingAction === "student-lock"}
                    disabled={
                      selectedLocked ||
                      !selectedStudent ||
                      selectedStudent.userId === null
                    }
                    icon={<UserLock size={18} />}
                    label={selectedLocked ? "이미 대여 금지" : "선택 유저 대여 금지"}
                    onClick={lockSelectedUser}
                  />
                  <ControlButton
                    busy={pendingAction === "umbrella-lock"}
                    disabled={
                      !selectedStudent || selectedStudent.deviceId === null
                    }
                    icon={<Lock size={18} />}
                    label="선택 우산 꽂이 잠금"
                    onClick={lockSelectedUmbrella}
                  />
                  <ControlButton
                    busy={pendingAction === "open-slot"}
                    disabled={
                      !selectedStudent || selectedStudent.deviceId === null
                    }
                    icon={<LockOpen size={18} />}
                    label="선택 슬롯 수동 열기"
                    onClick={openSelectedSlot}
                  />
                </div>

                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <label
                    className="text-sm font-bold text-slate-600"
                    htmlFor="student-select"
                  >
                    대상 학생
                  </label>
                  <select
                    id="student-select"
                    disabled={students.length === 0}
                    value={selectedId}
                    onChange={(event) => setSelectedId(event.target.value)}
                    className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    {students.length === 0 ? (
                      <option value="">동기화된 학생 없음</option>
                    ) : (
                      students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} · {student.className} · {student.id}
                        </option>
                      ))
                    )}
                  </select>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <MiniMetric
                      label="대여 횟수"
                      value={
                        selectedStudent
                          ? `${selectedStudent.borrowedCount}회`
                          : "-"
                      }
                    />
                    <MiniMetric
                      label="대여 기간"
                      value={selectedStudent?.rentalPeriod ?? "-"}
                    />
                    <MiniMetric
                      label="미반납 기간"
                      value={selectedStudent?.unreturnedPeriod ?? "-"}
                    />
                  </div>
                </div>
                </section>
              )}

              {isManualMessageView && (
                <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      수동 메시지
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      지정 학생에게 전송
                    </h2>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500 text-white">
                    <Send size={19} aria-hidden="true" />
                  </div>
                </div>

                <textarea
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  className="mt-5 min-h-28 w-full resize-none rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-500">
                    대상:{" "}
                    {selectedStudent
                      ? `${selectedStudent.name} · ${selectedStudent.id}`
                      : "선택된 학생 없음"}
                  </p>
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!selectedStudent}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sky-500 px-4 text-sm font-bold text-white transition hover:bg-sky-600"
                  >
                    <Send size={17} aria-hidden="true" />
                    메시지 전송
                  </button>
                </div>

                <div className="mt-5 max-h-52 overflow-y-auto rounded-lg border border-slate-200">
                  <div className="divide-y divide-slate-100">
                    {messages.map((message) => (
                      <div
                        key={`${message.time}-${message.target}-${message.body}`}
                        className="grid gap-2 px-4 py-3 sm:grid-cols-[72px_1fr_auto]"
                      >
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {message.time}
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                          {message.target}: {message.body}
                        </span>
                        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                          {message.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                </section>
              )}
            </div>

            {!isManualMessageView && (
              <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      대여 학생 목록
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      학생별 대여 기간
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-bold text-sky-700">
                    <CalendarClock size={16} aria-hidden="true" />
                    실시간 운영
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                        <th className="px-5 py-3">학생</th>
                        <th className="px-5 py-3">우산</th>
                        <th className="px-5 py-3">대여 기간</th>
                        <th className="px-5 py-3">대여 횟수</th>
                        <th className="px-5 py-3">미반납 기간</th>
                        <th className="px-5 py-3">상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.length === 0 && (
                        <tr>
                          <td
                            className="px-5 py-8 text-center text-sm font-semibold text-slate-500"
                            colSpan={6}
                          >
                            동기화된 학생 정보가 없습니다.
                          </td>
                        </tr>
                      )}
                      {students.map((student) => {
                        const locked = studentLocks.has(student.id);
                        const shownStatus = locked ? "잠금" : student.status;

                        return (
                          <tr
                            key={student.id}
                            className="text-sm transition hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-900">
                                {student.name}
                              </p>
                              <p className="mt-1 text-xs font-medium text-slate-500">
                                {student.className} · {student.id}
                              </p>
                            </td>
                            <td className="px-5 py-4 font-mono font-semibold text-slate-700">
                              {student.umbrella}
                            </td>
                            <td className="px-5 py-4 font-mono text-xs text-slate-500">
                              {student.rentalPeriod}
                            </td>
                            <td className="px-5 py-4 font-mono font-semibold text-slate-950">
                              {student.borrowedCount}
                            </td>
                            <td className="px-5 py-4 font-mono text-xs text-slate-500">
                              {student.unreturnedPeriod}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${statusTone(
                                  shownStatus,
                                )}`}
                              >
                                {shownStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="grid gap-6">
                <Panel title="로그 확인" eyebrow="운영 기록" icon={<History size={19} />}>
                  <div className="space-y-3">
                    {displayLogs.length === 0 && (
                      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-500">
                        표시할 대여/반납 로그가 없습니다.
                      </div>
                    )}
                    {displayLogs.map((log, index) => (
                      <div
                        key={`${index}-${log}`}
                        className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="문의 확인" eyebrow="학생 문의" icon={<Inbox size={19} />}>
                  <div className="space-y-3">
                    {inquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="rounded-md border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-950">
                              {inquiry.title}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              {inquiry.name} · {inquiry.time}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-bold text-sky-700">
                            {inquiry.state}
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={inquiry.state === "완료"}
                          onClick={() => completeInquiry(inquiry)}
                          className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-sky-200 disabled:bg-sky-50 disabled:text-sky-700"
                        >
                          {inquiry.state === "완료" ? "완료됨" : "완료"}
                        </button>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ControlButton({
  active,
  busy,
  disabled,
  icon,
  label,
  onClick,
}: {
  active?: boolean;
  busy?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  const buttonDisabled = disabled || busy;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={buttonDisabled}
      className={
        active
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-sky-200 bg-sky-100 px-4 text-sm font-bold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
          : "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {icon}
      {busy ? "처리 중" : label}
    </button>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function Panel({
  children,
  eyebrow,
  icon,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">{title}</h2>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500 text-white">
          {icon}
        </div>
      </div>
      {children}
    </section>
  );
}
