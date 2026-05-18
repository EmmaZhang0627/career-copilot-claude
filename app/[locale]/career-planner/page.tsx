import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, locales } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CareerPlannerPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  setRequestLocale(params.locale);

  const t = await getTranslations("comingSoon");

  return (
    <main className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <h1 className="text-3xl font-bold text-foreground">{t("message")}</h1>
    </main>
  );
}
