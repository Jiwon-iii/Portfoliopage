import { Zen_Kaku_Gothic_New } from "next/font/google"
import { SiteTopbar } from "@/components/site/topbar"
import { SiteFooter } from "@/components/site/footer"
import { getSiteLang } from "@/lib/site-lang"
import { pickLang } from "@/lib/i18n"
import { loadSite } from "@/lib/site-content"
import "./site.css"

// 일본어 글꼴이라 미리 받아 둘 subset 이 없음 → preload 끔 (글자 범위별로 필요할 때 받음)
const zen = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-zen",
})

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ lang, enabled }, data] = await Promise.all([getSiteLang(), loadSite()])
  return (
    <div className={`site ${zen.variable}`}>
      <SiteTopbar
        lang={lang}
        enabled={enabled}
        name={data.hero?.name}
        email={data.hero?.email}
        areas={data.expertise.map((x) => ({ id: x._id, label: x.navLabel || pickLang(x.title, lang) }))}
      />
      <main>{children}</main>
      <SiteFooter data={data} lang={lang} />
    </div>
  )
}
