import { notFound } from "next/navigation";

import { ResumeAnalyzerClient } from "@/components/resume-analyzer-client";
import { isLocale, locales } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function ResumeAnalyzerPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  return <ResumeAnalyzerClient locale={params.locale} />;
}
