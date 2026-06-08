"use client";

import { FormEvent, useMemo, useState } from "react";

type AnalysisResult = {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  improvements: string[];
  summary: string;
};

type ApiError = {
  code?: string;
  error?: string;
  providerMessage?: string;
  rawResponse?: string;
  requestId?: string;
};

type Locale = "en" | "zh";

const copy = {
  en: {
    eyebrow: "Resume Analyzer",
    title: "Match your resume to the role",
    subtitle:
      "Paste your resume and a target job description. Claude will score fit, surface missing keywords, and suggest concrete edits.",
    resumeLabel: "Your Resume",
    resumePlaceholder: "Paste resume text here",
    jdLabel: "Job Description",
    jdPlaceholder: "Paste the job description",
    button: "Analyze Now ->",
    loading: "Analyzing your resume...",
    emptyTitle: "Your analysis will appear here",
    emptyText:
      "You will see an ATS score, matched keywords, missing terms, improvements, and a short assessment.",
    matched: "Matched Keywords",
    missing: "Missing Keywords",
    improvements: "Improvement Suggestions",
    summary: "Summary",
    score: "ATS Score",
    required: "Please paste both your resume and the job description.",
    providerRejected:
      "The provider rejected this request. Check the model name, token group, balance, and API route configuration.",
    authError: "Provider authentication failed. Please check ANTHROPIC_API_KEY.",
    parseError:
      "The model returned a response that was not valid JSON. Try again, or inspect the raw response below.",
    genericError: "Something went wrong while analyzing your resume."
  },
  zh: {
    eyebrow: "简历分析器",
    title: "让简历更贴合目标岗位",
    subtitle:
      "粘贴你的简历和目标职位描述。Claude 会评估匹配度、找出缺失关键词，并给出具体修改建议。",
    resumeLabel: "你的简历",
    resumePlaceholder: "在这里粘贴简历文本",
    jdLabel: "职位描述",
    jdPlaceholder: "粘贴职位描述",
    button: "开始分析 ->",
    loading: "正在分析中...",
    emptyTitle: "分析结果会显示在这里",
    emptyText: "你会看到 ATS 分数、匹配关键词、缺失关键词、优化建议和总体评价。",
    matched: "匹配关键词",
    missing: "缺失关键词",
    improvements: "优化建议",
    summary: "总结",
    score: "ATS 分数",
    required: "请同时粘贴简历和职位描述。",
    providerRejected: "服务商拒绝了这次请求。请检查模型名、令牌分组、余额和 API 路由配置。",
    authError: "服务商认证失败，请检查 ANTHROPIC_API_KEY。",
    parseError: "模型返回的内容不是合法 JSON。可以重试，或查看下面的原始响应。",
    genericError: "分析简历时出错了，请稍后重试。"
  }
};

function getScoreColor(score: number) {
  if (score > 70) {
    return "var(--teal-500)";
  }

  if (score >= 50) {
    return "var(--amber)";
  }

  return "var(--red)";
}

function clampScore(score: number) {
  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

function getErrorMessage(payload: ApiError, labels: (typeof copy)[Locale]) {
  if (payload.code === "permission_error") {
    const detail = payload.providerMessage || payload.error;
    const requestId = payload.requestId ? ` Request ID: ${payload.requestId}` : "";

    return detail
      ? `${labels.providerRejected} Provider message: ${detail}${requestId}`
      : `${labels.providerRejected}${requestId}`;
  }

  if (payload.code === "authentication_error") {
    return labels.authError;
  }

  if (payload.code === "parse_error") {
    return payload.rawResponse
      ? `${labels.parseError}\n\nRaw response:\n${payload.rawResponse}`
      : labels.parseError;
  }

  return payload.error || labels.genericError;
}

export function ResumeAnalyzerClient({ locale }: { locale: Locale }) {
  const labels = copy[locale];
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const score = clampScore(result?.atsScore ?? 0);
  const scoreColor = useMemo(() => getScoreColor(score), [score]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!resume.trim() || !jobDescription.trim()) {
      setError(labels.required);
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resume, jobDescription })
      });

      const payload = (await response.json()) as AnalysisResult | ApiError;

      if (!response.ok) {
        throw new Error(getErrorMessage(payload as ApiError, labels));
      }

      setResult(payload as AnalysisResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : labels.genericError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-teal-50 pt-16">
      <section className="mx-auto grid w-full max-w-[1220px] gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-12">
        <form
          onSubmit={handleSubmit}
          className="rounded-[20px] border border-ink-20 bg-white p-5 shadow-[0_18px_60px_rgba(4,52,44,0.08)] sm:p-7"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            {labels.eyebrow}
          </p>
          <h1 className="mt-3 text-[42px] leading-tight text-ink sm:text-[52px]">
            {labels.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-ink-60">
            {labels.subtitle}
          </p>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2 text-sm font-semibold text-ink">
              {labels.resumeLabel}
              <textarea
                value={resume}
                onChange={(event) => setResume(event.target.value)}
                placeholder={labels.resumePlaceholder}
                className="min-h-[200px] resize-y rounded-xl border border-ink-20 bg-white p-4 text-base font-normal leading-7 text-ink outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ink">
              {labels.jdLabel}
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder={labels.jdPlaceholder}
                className="min-h-[200px] resize-y rounded-xl border border-ink-20 bg-white p-4 text-base font-normal leading-7 text-ink outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </label>
          </div>

          {error ? (
            <div className="mt-5 whitespace-pre-wrap rounded-xl border border-red/25 bg-red/10 p-4 text-sm font-semibold leading-6 text-red">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-teal-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isLoading ? labels.loading : labels.button}
          </button>
        </form>

        <aside className="rounded-[20px] border border-ink-20 bg-white p-5 shadow-[0_18px_60px_rgba(4,52,44,0.08)] sm:p-7">
          {isLoading ? (
            <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
              <p className="mt-5 text-base font-semibold text-ink">
                {labels.loading}
              </p>
            </div>
          ) : result ? (
            <div className="grid gap-6">
              <section className="rounded-2xl border border-ink-20 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-60">
                  {labels.score}
                </p>
                <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
                  <div
                    className="grid h-40 w-40 shrink-0 place-items-center rounded-full"
                    style={{
                      background: `conic-gradient(${scoreColor} 0 ${
                        score * 3.6
                      }deg, var(--teal-50) ${score * 3.6}deg 360deg)`
                    }}
                    aria-label={`${labels.score}: ${score}`}
                  >
                    <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
                      <span
                        className="text-5xl font-bold"
                        style={{ color: scoreColor }}
                      >
                        {score}
                      </span>
                    </div>
                  </div>
                  <p className="text-base leading-7 text-ink-60">
                    {result.summary}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl text-ink">{labels.matched}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.matchedKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700"
                    >
                      + {keyword}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-3xl text-ink">{labels.missing}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-[#fff2d8] px-3 py-1 text-sm font-semibold text-[#9a640d]"
                    >
                      - {keyword}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-3xl text-ink">{labels.improvements}</h2>
                <ol className="mt-4 grid gap-3">
                  {result.improvements.map((item, index) => (
                    <li
                      key={item}
                      className="rounded-r-xl border-l-4 border-teal-500 bg-white p-4 shadow-[0_8px_24px_rgba(4,52,44,0.07)]"
                    >
                      <span className="text-sm font-bold text-teal-700">
                        {index + 1}.
                      </span>{" "}
                      <span className="text-sm leading-6 text-ink-60">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-2xl bg-teal-50 p-5">
                <h2 className="text-3xl text-ink">{labels.summary}</h2>
                <p className="mt-3 text-base leading-7 text-ink-60">
                  {result.summary}
                </p>
              </section>
            </div>
          ) : (
            <div className="flex min-h-[620px] flex-col justify-center rounded-2xl border border-dashed border-ink-20 bg-teal-50/55 p-8">
              <h2 className="text-[38px] leading-tight text-ink">
                {labels.emptyTitle}
              </h2>
              <p className="mt-4 max-w-[420px] text-base leading-7 text-ink-60">
                {labels.emptyText}
              </p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
