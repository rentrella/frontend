"use client";

import { useEffect, useState } from "react";

type Umbrella = {
  id: string;
  available: boolean;
};

type WeatherKind = "sunny" | "rain" | "snow" | "cloudy";

type WeatherState = {
  kind: WeatherKind;
  label: string;
  temperature: number | null;
};

const initialUmbrellas: Umbrella[] = [
  { id: "01", available: true },
  { id: "02", available: false },
  { id: "03", available: true },
  { id: "04", available: true },
  { id: "05", available: false },
  { id: "06", available: true },
  { id: "07", available: true },
  { id: "08", available: false },
  { id: "09", available: true },
  { id: "10", available: true },
  { id: "11", available: false },
  { id: "12", available: true },
];

const weatherLabels: Record<WeatherKind, string> = {
  sunny: "화창함",
  rain: "비",
  snow: "눈",
  cloudy: "흐림",
};

const weatherOptions: { kind: WeatherKind; label: string }[] = [
  { kind: "sunny", label: "맑음" },
  { kind: "rain", label: "비" },
  { kind: "snow", label: "눈" },
  { kind: "cloudy", label: "흐림" },
];

const sunnyBushes = [
  { left: 29, bottom: 18, size: 26, color: "#238f4f" },
  { left: 62, bottom: 17, size: 31, color: "#238f4f" },
  { left: 88, bottom: 15, size: 24, color: "#238f4f" },
];

function getWeatherKind(code: number): WeatherKind {
  if ([0, 1].includes(code)) return "sunny";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if (
    [
      51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
    ].includes(code)
  ) {
    return "rain";
  }
  return "cloudy";
}

function UmbrellaIcon({
  muted = false,
  className = "",
}: {
  muted?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={muted ? "text-[#cbd5df]" : className || "text-[#6bb8f0]"}
      fill="none"
      height="28"
      viewBox="0 0 28 28"
      width="28"
    >
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
      <path
        d="M14 6.2V3.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.35"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
    >
      <path
        d="M9 3.6c-2.8 0-5 1.8-5 4.1 0 1.3.7 2.5 1.8 3.2l-.5 2.2 2.4-1.3c.4.1.8.1 1.3.1 2.8 0 5-1.8 5-4.2S11.8 3.6 9 3.6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CloudShape({
  className = "",
  delay = "0s",
}: {
  className?: string;
  delay?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`weather-cloud absolute ${className}`}
      fill="none"
      height="116"
      style={{ animationDelay: `-${delay}` }}
      viewBox="0 0 260 116"
      width="260"
    >
      <path
        d="M30.5 83.7C16.8 79.1 8 68 8 54.6c0-19.8 18.7-35.8 41.8-35.8 4.5 0 8.8.6 12.8 1.8C74.7 8.4 94.4 2.3 114.7 6.5c17.8 3.7 32.2 14.7 38.1 28.3 9.4-5.8 22.1-8 34.8-5.4 20.2 4.2 34.8 18.2 35.7 34.2 17.8 2.7 30.7 13.1 28.4 25.3-2.6 13.4-22.7 20.9-44.9 16.8-5.8-1.1-11.1-2.8-15.8-5.1-10.8 8.7-29.7 12.5-49.7 8.8-8.3-1.6-15.9-4.2-22.3-7.6-12.9 7.2-32.8 9-53.1 4.3C48.3 102 34.9 93.8 30.5 83.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WeatherScene({ weather }: { weather: WeatherState }) {
  if (weather.kind === "rain") {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#4c94d4_0%,#79bef2_48%,#a8d9ff_100%)]"
      >
        <div className="absolute -left-12 top-8 h-36 w-64 rounded-full bg-[#355f96]/25 blur-2xl" />
        {Array.from({ length: 46 }).map((_, index) => (
          <span
            className="weather-rain absolute -top-10 h-20 w-[2px] rounded-full bg-white/65"
            key={index}
            style={{
              animationDelay: `-${0.12 + (index % 12) * 0.1}s`,
              animationDuration: `${0.72 + (index % 5) * 0.07}s`,
              left: `${(index * 5.2) % 100}%`,
            }}
          />
        ))}
      </div>
    );
  }

  if (weather.kind === "snow") {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#8db8e8_0%,#b9ddff_52%,#ecf7ff_100%)]"
      >
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white/35" />
        {Array.from({ length: 46 }).map((_, index) => (
          <span
            className="weather-snow absolute -top-8 rounded-full bg-white/90"
            key={index}
            style={{
              animationDelay: `-${0.35 + (index % 14) * 0.15}s`,
              animationDuration: `${2.8 + (index % 6) * 0.3}s`,
              height: `${6 + (index % 4) * 2}px`,
              left: `${(index * 7.5) % 100}%`,
              width: `${6 + (index % 4) * 2}px`,
            }}
          />
        ))}
      </div>
    );
  }

  if (weather.kind === "sunny") {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#65b9f2_0%,#8bd1ff_52%,#bde9ff_100%)]"
      >
        <div className="weather-sun absolute right-28 top-8 h-28 w-28 rounded-full bg-[#ffe477] shadow-[0_0_58px_rgba(255,228,119,0.8)]" />
        <div className="absolute -bottom-14 -left-10 h-32 w-[58%] rounded-[50%] bg-[#61c978]" />
        <div className="absolute -bottom-16 right-[-8%] h-36 w-[70%] rounded-[50%] bg-[#42b565]" />
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-[linear-gradient(180deg,rgba(86,201,113,0.35)_0%,#35a95c_100%)]" />
        {sunnyBushes.map((bush) => (
          <div
            className="absolute"
            key={`bush-${bush.left}`}
            style={{
              bottom: `${bush.bottom}px`,
              height: `${bush.size}px`,
              left: `${bush.left}%`,
              width: `${bush.size * 1.65}px`,
            }}
          >
            <span
              className="absolute bottom-0 left-0 h-full w-[58%] rounded-full"
              style={{ backgroundColor: bush.color }}
            />
            <span
              className="absolute bottom-0 left-[28%] h-[80%] w-[58%] rounded-full"
              style={{ backgroundColor: bush.color }}
            />
            <span
              className="absolute bottom-0 left-[56%] h-[62%] w-[44%] rounded-full"
              style={{ backgroundColor: bush.color }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#7ab7ec_0%,#9ccdf4_48%,#bfdff6_100%)]"
    >
      <CloudShape className="right-8 top-4 text-white/45" />
      <CloudShape className="right-72 top-14 scale-75 text-white/32" delay="0.7s" />
      <CloudShape className="left-16 top-20 scale-90 text-white/25" delay="1.2s" />
      <div className="absolute -left-10 bottom-4 h-28 w-64 rounded-full bg-[#5b8cc3]/15 blur-xl" />
    </div>
  );
}

function UmbrellaCard({
  umbrella,
  onBorrow,
}: {
  umbrella: Umbrella;
  onBorrow: () => void;
}) {
  return (
    <article
      className={[
        "min-h-[208px] rounded-[26px] border bg-white p-6 shadow-[0_10px_26px_rgba(35,49,72,0.04)]",
        umbrella.available
          ? "border-[#e1e8f0]"
          : "border-[#edf1f6] opacity-45",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div
          className={[
            "flex h-[62px] w-[62px] items-center justify-center rounded-[17px]",
            umbrella.available ? "bg-[#e3f1ff]" : "bg-[#eef3f9]",
          ].join(" ")}
        >
          <UmbrellaIcon muted={!umbrella.available} />
        </div>
        <span
          className={[
            "rounded-full px-5 py-2 text-[15px] font-black leading-none",
            umbrella.available
              ? "bg-[#e8f4ff] text-[#55aeee]"
              : "bg-[#e4e9f1] text-[#96a1af]",
          ].join(" ")}
        >
          {umbrella.available ? "가능" : "빌려짐"}
        </span>
      </div>

      <h2
        className={[
          "mt-5 text-[24px] font-black leading-8 tracking-[-0.02em]",
          umbrella.available ? "text-[#101527]" : "text-[#9aa5b8]",
        ].join(" ")}
      >
        우산 #{umbrella.id}
      </h2>
      <p
        className={[
          "mt-1 text-[15px] font-medium",
          umbrella.available ? "text-[#8996a8]" : "text-[#b1bbc8]",
        ].join(" ")}
      >
        {umbrella.available ? "대여 가능" : "현재 대여 중"}
      </p>

      <button
        className={[
          "mt-3 h-11 w-full rounded-[14px] text-[17px] font-black",
          umbrella.available
            ? "bg-[#6db6ed] text-white shadow-[0_9px_16px_rgba(109,182,237,0.22)]"
            : "bg-[#edf2f7] text-[#b7c1ce]",
        ].join(" ")}
        disabled={!umbrella.available}
        onClick={onBorrow}
        type="button"
      >
        {umbrella.available ? "빌리기" : "⊗  대여불가"}
      </button>
    </article>
  );
}

export default function Home() {
  const [umbrellas, setUmbrellas] = useState(initialUmbrellas);
  const [message, setMessage] = useState("");
  const [weather, setWeather] = useState<WeatherState>({
    kind: "cloudy",
    label: "날씨 확인 중",
    temperature: null,
  });

  const availableCount = umbrellas.filter((umbrella) => umbrella.available).length;

  const borrowUmbrella = (id: string) => {
    setUmbrellas((current) =>
      current.map((umbrella) =>
        umbrella.id === id ? { ...umbrella, available: false } : umbrella,
      ),
    );
    setMessage(`우산 #${id} 대여가 완료되었습니다.`);
  };

  const openInquiry = () => {
    setMessage("문의가 접수되었습니다.");
  };

  const previewWeather = (kind: WeatherKind) => {
    setWeather({
      kind,
      label: weatherLabels[kind],
      temperature: weather.temperature,
    });
  };

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async (latitude = 37.5665, longitude = 126.978) => {
      try {
        const params = new URLSearchParams({
          current: "temperature_2m,weather_code",
          latitude: String(latitude),
          longitude: String(longitude),
          timezone: "auto",
        });
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
        );
        if (!response.ok) throw new Error("Failed to load weather");

        const data = (await response.json()) as {
          current?: {
            temperature_2m?: number;
            weather_code?: number;
          };
        };
        const code = data.current?.weather_code ?? 3;
        const kind = getWeatherKind(code);

        if (!cancelled) {
          setWeather({
            kind,
            label: weatherLabels[kind],
            temperature:
              typeof data.current?.temperature_2m === "number"
                ? Math.round(data.current.temperature_2m)
                : null,
          });
        }
      } catch {
        if (!cancelled) {
          setWeather({
            kind: "cloudy",
            label: "날씨 확인 불가",
            temperature: null,
          });
        }
      }
    };

    if (!navigator.geolocation) {
      void loadWeather();
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void loadWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        void loadWeather();
      },
      { maximumAge: 1000 * 60 * 10, timeout: 5000 },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f9fc] text-[#111728]">
      <header className="border-b border-[#e2ebf3] bg-white">
        <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-8">
          <div className="flex items-center gap-5">
            <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[17px] bg-[#68b5ef] text-white">
              <UmbrellaIcon className="text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-[33px] font-black leading-[1.02] tracking-[-0.03em]">
                Rentrella
              </h1>
              <p className="mt-0.5 text-[17px] font-medium leading-[1.12] text-[#9aa5b3]">
                우산 대여 서비스
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-[15px] font-black text-[#667085] md:flex">
            <a href="#umbrellas">우산 목록</a>
            <a href="#status">대여 현황</a>
          </nav>

          <button
            className="flex h-[46px] items-center gap-3 rounded-full border border-[#bfddf5] bg-[#e7f5ff] px-6 text-[17px] font-black text-[#5daeea]"
            onClick={openInquiry}
            type="button"
          >
            <ChatIcon />
            문의하기
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-8 py-10">
        <div>
          <section
            className="relative flex min-h-[210px] items-center justify-between overflow-hidden rounded-[31px] bg-[#7dc0f2] px-10 py-8 text-white shadow-[0_18px_32px_rgba(104,181,239,0.2)]"
            id="status"
          >
            <WeatherScene weather={weather} />
            <div className="relative z-10">
              <p className="text-[18px] font-black">현재 대여 가능</p>
              <div className="mt-2 flex items-end gap-3">
                <strong className="text-[72px] font-black leading-[0.92]">
                  {availableCount}
                </strong>
                <span className="pb-3 text-[34px] font-black">
                  / {umbrellas.length}
                </span>
              </div>
              <p className="mt-3 text-[15px] font-bold text-white/85">
                현재 날씨: {weather.label}
                {weather.temperature !== null ? ` · ${weather.temperature}°C` : ""}
              </p>
            </div>
          </section>

          <div className="mt-4 flex flex-wrap gap-3">
            {weatherOptions.map((option) => (
              <button
                className={[
                  "h-11 rounded-full px-6 text-[15px] font-black shadow-[0_10px_24px_rgba(35,49,72,0.06)]",
                  weather.kind === option.kind
                    ? "bg-[#111728] text-white"
                    : "border border-[#dce6ef] bg-white text-[#59677d]",
                ].join(" ")}
                key={option.kind}
                onClick={() => previewWeather(option.kind)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          {message && (
            <p className="mt-5 rounded-2xl bg-[#eef7ff] px-5 py-3 text-[15px] font-bold text-[#4d9dde]">
              {message}
            </p>
          )}
        </div>

        <section className="mt-10" id="umbrellas">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[17px] font-black text-[#59677d]">우산 목록</p>
              <h2 className="mt-2 text-[32px] font-black tracking-[-0.03em]">
                대여 가능한 우산
              </h2>
            </div>
            <p className="hidden text-[15px] font-bold text-[#8996a8] sm:block">
              총 {umbrellas.length}개 중 {availableCount}개 가능
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {umbrellas.map((umbrella) => (
            <UmbrellaCard
              key={umbrella.id}
              onBorrow={() => borrowUmbrella(umbrella.id)}
              umbrella={umbrella}
            />
          ))}
          </div>
        </section>
      </section>
    </main>
  );
}
