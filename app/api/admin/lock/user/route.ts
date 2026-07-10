import { NextResponse } from "next/server";
import { proxyBackend } from "../../../_backend";

function toPositiveInteger(value: unknown) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { userId?: unknown }
    | null;
  const userId = toPositiveInteger(body?.userId);

  if (userId === null) {
    return NextResponse.json(
      { status: "error", msg: "userId가 필요합니다." },
      { status: 400 },
    );
  }

  return proxyBackend("/lock/user", {
    body: { userId },
    method: "PATCH",
  });
}
