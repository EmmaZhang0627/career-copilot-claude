import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { isLocale, locales } from "@/lib/i18n";

const painPoints = [
  {
    icon: "🧾",
    title: "Resume Formatting",
    zh: "简历格式不清",
    description: "Keep every section polished, concise, and ready for global hiring teams."
  },
  {
    icon: "🔎",
    title: "ATS Unfriendly",
    zh: "ATS 难以识别",
    description: "Find gaps between your resume and the exact keywords recruiters expect."
  },
  {
    icon: "💬",
    title: "Workplace English",
    zh: "职场英语表达",
    description: "Practice clear, confident language for interviews and day-to-day work."
  },
  {
    icon: "🧭",
    title: "Career Confusion",
    zh: "求职方向迷茫",
    description: "Turn scattered goals into a practical plan for your target market."
  }
];

const features = [
  {
    icon: "📄",
    title: "Resume Analyzer",
    zh: "简历分析器",
    description: "Compare your resume against a job description and get ATS-ready edits.",
    href: "/resume-analyzer"
  },
  {
    icon: "🎙️",
    title: "Interview Coach",
    zh: "面试教练",
    description: "Practice behavioral answers with structure, tone, and follow-up coaching.",
    href: "/interview-coach"
  },
  {
    icon: "🗺️",
    title: "Career Planner",
    zh: "职业规划器",
    description: "Map roles, skills, and weekly actions for a focused international search.",
    href: "/career-planner"
  }
];

const steps = [
  {
    title: "Paste materials",
    zh: "粘贴材料",
    description: "Add your resume, target job post, or interview prompt."
  },
  {
    title: "Get AI analysis",
    zh: "获取 AI 分析",
    description: "Claude reviews fit, clarity, keywords, and next steps."
  },
  {
    title: "Practice & apply",
    zh: "练习并投递",
    description: "Refine your materials, rehearse answers, and apply with confidence."
  }
];

function withLocalePrefix(path: string, locale: string) {
  return `/${locale}${path}`;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  setRequestLocale(params.locale);

  return (
    <main className="overflow-hidden bg-white pt-16">
      <section className="career-grid-bg relative">
        <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-[1180px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.03fr_0.97fr] lg:px-12 lg:py-20">
          <div className="max-w-[650px]">
            <h1 className="text-[46px] leading-[0.98] text-ink sm:text-[56px]">
              Land your{" "}
              <span className="italic text-teal-500">dream job</span> abroad
            </h1>
            <p className="mt-5 font-serif text-[22px] leading-7 text-ink-60">
              专为留学生打造的 AI 求职助手
            </p>
            <p className="mt-6 max-w-[560px] text-base font-light leading-8 text-ink-60">
              CareerCopilot helps international students tailor resumes,
              decode job descriptions, practice interviews, and plan a clearer
              route into global careers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={withLocalePrefix("/resume-analyzer", params.locale)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-teal-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
              >
                Analyze My Resume
              </Link>
              <Link
                href={withLocalePrefix("/interview-coach", params.locale)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-ink-20 bg-white/60 px-6 text-sm font-semibold text-ink transition-colors hover:border-teal-500 hover:text-teal-700"
              >
                Try Interview Coach →
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px] lg:mr-0">
            <div className="floating-preview-card rounded-[22px] border border-ink-20 bg-white shadow-[0_24px_80px_rgba(4,52,44,0.16)]">
              <div className="flex h-12 items-center gap-2 border-b border-ink-20 px-5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div
                    className="grid h-32 w-32 shrink-0 place-items-center rounded-full"
                    style={{
                      background:
                        "conic-gradient(var(--teal-500) 0 266deg, var(--teal-50) 266deg 360deg)"
                    }}
                    aria-label="ATS score 74 percent"
                  >
                    <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center">
                      <span className="text-4xl font-bold text-teal-700">
                        74
                      </span>
                      <span className="-mt-4 text-xs font-semibold text-ink-60">
                        ATS
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-60">
                      Resume match
                    </p>
                    <h2 className="mt-2 text-3xl text-ink">
                      Strong base, sharper keywords needed.
                    </h2>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["React", "SQL", "User research"].map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700"
                    >
                      ✓ {keyword}
                    </span>
                  ))}
                  {["A/B testing", "Roadmap"].map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-[#fff2d8] px-3 py-1 text-sm font-semibold text-[#9a640d]"
                    >
                      ✗ {keyword}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-teal-50 p-4 text-sm leading-6 text-teal-900">
                  Add one quantified product impact bullet and mirror the JD's
                  analytics language in your experience section.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-teal-900 text-white">
        <div className="mx-auto grid max-w-[1180px] px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {painPoints.map((item) => (
            <article
              key={item.title}
              className="border-b border-white/15 py-8 transition-colors hover:bg-teal-700/20 md:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 lg:px-7"
            >
              <div className="text-3xl" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm font-semibold text-teal-100">
                {item.zh}
              </p>
              <p className="mt-4 text-sm leading-6 text-white/70">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[20px] border border-ink-20 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-teal-500"
              >
                <div className="text-4xl" aria-hidden="true">
                  {feature.icon}
                </div>
                <h2 className="mt-6 text-3xl text-ink">{feature.title}</h2>
                <p className="mt-1 text-sm font-semibold text-teal-700">
                  {feature.zh}
                </p>
                <p className="mt-4 text-base leading-7 text-ink-60">
                  {feature.description}
                </p>
                <Link
                  href={withLocalePrefix(feature.href, params.locale)}
                  className="mt-6 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-500"
                >
                  Try now →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-50 py-20">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-teal-700 text-lg font-bold text-white">
                  {index + 1}
                </div>
                <h2 className="mt-6 text-3xl text-ink">{step.title}</h2>
                <p className="mt-1 text-sm font-semibold text-teal-700">
                  {step.zh}
                </p>
                <p className="mt-4 max-w-[300px] text-base leading-7 text-ink-60">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-center">
        <div className="mx-auto max-w-[780px] px-5">
          <h2 className="text-[42px] leading-tight text-ink sm:text-[52px]">
            Build a job search that sounds like you and reads like the role.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={withLocalePrefix("/resume-analyzer", params.locale)}
              className="inline-flex h-12 items-center justify-center rounded-full bg-teal-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              Analyze My Resume
            </Link>
            <Link
              href={withLocalePrefix("/career-planner", params.locale)}
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink-20 px-6 text-sm font-semibold text-ink transition-colors hover:border-teal-500 hover:text-teal-700"
            >
              Plan My Search →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-20 bg-white">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-ink-60 sm:flex-row sm:px-8 lg:px-12">
          <Link
            href={`/${params.locale}`}
            className="font-serif text-2xl text-teal-700"
          >
            Career<span className="italic text-teal-300">Copilot</span>
          </Link>
          <p>© 2026 CareerCopilot. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
