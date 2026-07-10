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
    | { deviceId?: unknown }
    | null;
  const deviceId = toPositiveInteger(body?.deviceId);

  if (deviceId === null) {
    return NextResponse.json(
      { status: "error", msg: "deviceId가 필요합니다." },
      { status: 400 },
    );
  }

  return proxyBackend("/lock/umbrella", {
    body: { deviceId },
    method: "PATCH",
  });
}
