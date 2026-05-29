import { SiteTopbar } from "@/components/site/topbar"
import { SiteFooter } from "@/components/site/contact"
import { getSiteLang } from "@/lib/site-lang"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { lang, enabled } = await getSiteLang()
  return (
    <>
      <SiteTopbar lang={lang} enabled={enabled} />
      {children}
      <SiteFooter />
    </>
  )
}
