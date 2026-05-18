import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/lib/i18n";

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix: "always"
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
