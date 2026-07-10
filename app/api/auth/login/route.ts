import { NextResponse } from "next/server";
import { proxyBackend } from "../../_backend";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  if (!isRecord(body)) {
    return NextResponse.json(
      { status: "error", msg: "로그인 정보가 필요합니다." },
      { status: 400 },
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { status: "error", msg: "이메일과 비밀번호를 입력해 주세요." },
      { status: 400 },
    );
  }

  return proxyBackend("/login", {
    body: { email, password },
    method: "POST",
  });
}
