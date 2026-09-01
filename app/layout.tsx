import type { Metadata } from "next"
import { Geist, JetBrains_Mono, Instrument_Serif } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { getSiteLang } from "@/lib/site-lang"
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
  description: "Next.js로 풀스택 웹을 만들고, 거기에 AI를 자연스럽게 녹여내는 개발자.",
  authors: [{ name: "Shin Jiwon", url: "https://github.com/Jiwon-iii" }],
  creator: "Shin Jiwon",
  keywords: ["신지원", "Shin Jiwon", "포트폴리오", "Next.js", "AI", "풀스택", "Portfolio"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "신지원 Portfolio",
    title: "신지원 / Shin Jiwon — Portfolio",
    description: "Next.js로 풀스택 웹을 만들고, 거기에 AI를 자연스럽게 녹여내는 개발자.",
  },
  twitter: {
    card: "summary_large_image",
    title: "신지원 / Shin Jiwon — Portfolio",
    description: "Next.js로 풀스택 웹을 만들고, 거기에 AI를 자연스럽게 녹여내는 개발자.",
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await getSiteLang()
  return (
    <html lang={lang} className={`${geist.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Pretendard - 한국어 본문 폰트 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* Noto Sans JP - 일본어 본문 폰트 (없으면 가나/한자가 시스템 폴백으로 깨짐) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
