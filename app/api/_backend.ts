import { NextResponse } from "next/server";

type BackendProxyOptions = {
  body?: unknown;
  method?: "GET" | "POST" | "PATCH";
};

function getBackendUrl(path: string) {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    return null;
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return new URL(normalizedPath, normalizedBase);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getMessage(payload: unknown, fallback: string) {
  if (!isRecord(payload)) {
    return fallback;
  }

  const message = payload.msg ?? payload.message ?? payload.error;

  return typeof message === "string" && message.trim().length > 0
    ? message
    : fallback;
}

export async function proxyBackend(
  path: string,
  { body, method = "GET" }: BackendProxyOptions = {},
) {
  const url = getBackendUrl(path);

  if (!url) {
    return NextResponse.json(
      { status: "error", msg: "API_BASE_URL이 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const headers = new Headers({
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  });

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      headers,
      method,
    });
    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();
    const payload =
      text.length > 0 && contentType.includes("application/json")
        ? (JSON.parse(text) as unknown)
        : text;

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          msg: getMessage(payload, `백엔드 요청 실패 (${response.status})`),
        },
        { status: response.status },
      );
    }

    if (contentType.includes("application/json")) {
      return NextResponse.json(payload);
    }

    return NextResponse.json({ status: "success", data: payload });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        msg:
          error instanceof Error
            ? error.message
            : "백엔드 요청 중 알 수 없는 오류가 발생했습니다.",
      },
      { status: 502 },
    );
  }
}
