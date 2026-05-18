"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const localePrefixes = ["en", "zh"];

function getLocalizedPath(pathname: string, targetLocale: string) {
  const segments = pathname.split("/");
  const hasLocalePrefix = localePrefixes.includes(segments[1]);
  const pathWithoutLocale = hasLocalePrefix
    ? `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/"
    : pathname;

  return pathWithoutLocale === "/"
    ? `/${targetLocale}`
    : `/${targetLocale}${pathWithoutLocale}`;
}

export function Navigation() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-20 bg-white/78 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          href={`/${locale}`}
          className="font-serif text-[26px] leading-none text-teal-700"
          aria-label="CareerCopilot home"
        >
          Career
          <span className="italic text-teal-300">Copilot</span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div
            aria-label="Language toggle"
            className="flex h-10 items-center rounded-full border border-ink-20 bg-white/80 p-1 text-sm font-semibold text-ink"
          >
            <Link
              href={getLocalizedPath(pathname, "en")}
              className={cn(
                "rounded-full px-3 py-1.5 transition-colors",
                locale === "en"
                  ? "bg-teal-700 text-white"
                  : "text-ink-60 hover:text-teal-700"
              )}
            >
              EN
            </Link>
            <span className="text-ink-20">|</span>
            <Link
              href={getLocalizedPath(pathname, "zh")}
              className={cn(
                "rounded-full px-3 py-1.5 transition-colors",
                locale === "zh"
                  ? "bg-teal-700 text-white"
                  : "text-ink-60 hover:text-teal-700"
              )}
            >
              中文
            </Link>
          </div>

          <Link
            href={`/${locale}/resume-analyzer`}
            className="hidden h-10 items-center justify-center rounded-full bg-teal-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 sm:inline-flex"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
