import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export default getRequestConfig(async () => {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  const locale: Locale = LOCALES.includes(value as Locale)
    ? (value as Locale)
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
