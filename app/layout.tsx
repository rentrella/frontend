import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rentrella",
  description: "필요한 물건을 필요한 기간만 대여하는 렌탈 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
