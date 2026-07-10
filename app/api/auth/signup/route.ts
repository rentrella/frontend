import { NextResponse } from "next/server";
import { proxyBackend } from "../../_backend";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidPassword(password: string) {
  return (
    password.length >= 6 &&
    password.length <= 20 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  if (!isRecord(body)) {
    return NextResponse.json(
      { status: "error", msg: "회원가입 정보가 필요합니다." },
      { status: 400 },
    );
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!/^[A-Za-z0-9._%+-]+@gsm\.hs\.kr$/.test(email)) {
    return NextResponse.json(
      { status: "error", msg: "학교 이메일을 입력해 주세요." },
      { status: 400 },
    );
  }

  if (!isValidPassword(password)) {
    return NextResponse.json(
      {
        status: "error",
        msg: "비밀번호는 6~20자, 영문+숫자+특수문자를 포함해야 합니다.",
      },
      { status: 400 },
    );
  }

  return proxyBackend("/auth/signup", {
    body: { email, password },
    method: "POST",
  });
}
