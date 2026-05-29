import type { Metadata } from "next"
import { Geist, JetBrains_Mono, Instrument_Serif } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

/**
 * Fonts:
 * - Geist: 큰 글자 / 영문 (Vercel 자체 글꼴 — Next.js 정체성 시그널)
 * - JetBrains Mono: 모노 / 번호 / 기술 라벨
 * - Instrument Serif: 이탤릭 강조 (예: *AI* 단어)
 * - Pretendard: 한글 본문 (CDN 으로 별도 link)
 */
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "신지원 / Shin Jiwon — Portfolio",
    template: "%s · 신지원",
  },
  description: "Next.js로 풀스택 웹을 만들면서 거기에 AI를 박아넣는 개발자.",
  authors: [{ name: "Shin Jiwon", url: "https://github.com/Jiwon-iii" }],
  creator: "Shin Jiwon",
  keywords: ["신지원", "Shin Jiwon", "포트폴리오", "Next.js", "AI", "풀스택", "Portfolio"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "신지원 Portfolio",
    title: "신지원 / Shin Jiwon — Portfolio",
    description: "Next.js로 풀스택 웹을 만들면서 거기에 AI를 박아넣는 개발자.",
  },
  twitter: {
    card: "summary_large_image",
    title: "신지원 / Shin Jiwon — Portfolio",
    description: "Next.js로 풀스택 웹을 만들면서 거기에 AI를 박아넣는 개발자.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Pretendard - 한국어 본문 폰트 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
