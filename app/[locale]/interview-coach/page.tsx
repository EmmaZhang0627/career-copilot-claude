import { notFound } from "next/navigation";

import { isLocale, locales } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function InterviewCoachPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-teal-50 px-5 pt-32">
      <section className="mx-auto max-w-[880px] rounded-[20px] border border-ink-20 bg-white p-8">
        <h1 className="text-[48px] leading-tight text-ink">Interview Coach</h1>
        <p className="mt-4 text-base leading-7 text-ink-60">
          Mock interviews and STAR answer coaching are coming next.
        </p>
      </section>
    </main>
  );
}
