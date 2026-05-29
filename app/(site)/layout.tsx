import { SiteTopbar } from "@/components/site/topbar"
import { SiteFooter } from "@/components/site/contact"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteTopbar lang="ko" />
      {children}
      <SiteFooter />
    </>
  )
}
