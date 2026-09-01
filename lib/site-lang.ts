import { cookies } from "next/headers"
import { getSettings } from "@/lib/repo/settings"
import type { Lang } from "@/lib/i18n"
import { LANG_COOKIE } from "@/lib/lang-cookie"

export { LANG_COOKIE }

/**
 * 사이트 표시 언어 결정.
 *  - 쿠키 `lang` 이 enabledLanguages 안에 있으면 그 언어
 *  - 아니면 defaultLanguage (없으면 ko)
 * enabled 목록은 토팁바에서 토글 버튼을 그릴 때 사용.
 */
export async function getSiteLang(): Promise<{ lang: Lang; enabled: Lang[] }> {
  let enabled: Lang[] = ["ko", "ja"]
  let def: Lang = "ja"
  try {
    const settings = await getSettings()
    if (settings?.enabledLanguages?.length) enabled = settings.enabledLanguages as Lang[]
    if (settings?.defaultLanguage) def = settings.defaultLanguage as Lang
  } catch {
    // DB 미연결 시 ko 폴백
  }
  const cookieStore = await cookies()
  const v = cookieStore.get(LANG_COOKIE)?.value as Lang | undefined
  const lang = v && enabled.includes(v) ? v : def
  return { lang, enabled }
}
