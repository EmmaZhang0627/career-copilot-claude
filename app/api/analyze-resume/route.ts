import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type MessageRequest = {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: "user";
    content: string;
  }>;
};

type MessageResponse = {
  content: Array<{
    type: string;
    text?: string;
  }>;
};

type ResumeAnalysis = {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  improvements: string[];
  summary: string;
};

type ApiErrorPayload = {
  error?: {
    type?: string;
    message?: string;
  };
  message?: string;
  request_id?: string;
};

class ProviderApiError extends Error {
  status: number;
  type?: string;
  requestId?: string;

  constructor({
    message,
    requestId,
    status,
    type
  }: {
    message: string;
    requestId?: string;
    status: number;
    type?: string;
  }) {
    super(message);
    this.name = "ProviderApiError";
    this.requestId = requestId;
    this.status = status;
    this.type = type;
  }
}

function parseProviderErrorBody(body: string): ApiErrorPayload | null {
  try {
    return JSON.parse(body) as ApiErrorPayload;
  } catch {
    return null;
  }
}

function extractJsonObject(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return candidate.trim();
  }

  return candidate.slice(start, end + 1);
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item)).filter(Boolean)
    : [];
}

function parseResumeAnalysis(text: string): ResumeAnalysis {
  const parsed = JSON.parse(extractJsonObject(text)) as Partial<ResumeAnalysis>;
  const atsScore = Number(parsed.atsScore);

  if (!Number.isFinite(atsScore)) {
    throw new Error("Missing atsScore");
  }

  return {
    atsScore: Math.min(100, Math.max(0, Math.round(atsScore))),
    matchedKeywords: asStringArray(parsed.matchedKeywords),
    missingKeywords: asStringArray(parsed.missingKeywords),
    improvements: asStringArray(parsed.improvements).slice(0, 5),
    summary: String(parsed.summary || "")
  };
}

function getMessagesUrl() {
  const baseUrl =
    process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com";
  const trimmed = baseUrl.replace(/\/+$/, "");

  if (trimmed.endsWith("/v1/messages")) {
    return trimmed;
  }

  if (trimmed.endsWith("/v1")) {
    return `${trimmed}/messages`;
  }

  return `${trimmed}/v1/messages`;
}

function getModelCandidates() {
  if (process.env.ANTHROPIC_MODEL) {
    return process.env.ANTHROPIC_MODEL.split(",")
      .map((model) => model.trim())
      .filter(Boolean);
  }

  return ["claude-sonnet-4-6", "claude-haiku-4-5"];
}

function toClientError(error: unknown) {
  if (error instanceof ProviderApiError) {
    if (error.status === 401) {
      return {
        body: {
          code: "authentication_error",
          error: "Provider authentication failed. Please check ANTHROPIC_API_KEY."
        },
        status: 401
      };
    }

    return {
      body: {
        code: error.status === 403 ? "permission_error" : error.type || "provider_error",
        error: error.message,
        providerMessage: error.message,
        requestId: error.requestId
      },
      status: error.status
    };
  }

  return {
    body: {
      code: "unknown_error",
      error: error instanceof Error ? error.message : "Unable to analyze resume"
    },
    status: 500
  };
}

async function createMessage(request: MessageRequest, apiKey: string) {
  const response = await fetch(getMessagesUrl(), {
    method: "POST",
    headers: {
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const body = await response.text();
    const parsed = parseProviderErrorBody(body);

    throw new ProviderApiError({
      message:
        parsed?.error?.message ||
        parsed?.message ||
        body ||
        `Provider request failed with status ${response.status}`,
      requestId:
        parsed?.request_id || response.headers.get("request-id") || undefined,
      status: response.status,
      type: parsed?.error?.type
    });
  }

  return (await response.json()) as MessageResponse;
}

export async function POST(req: NextRequest) {
  const { resume, jobDescription } = await req.json();

  if (!resume || !jobDescription) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Missing ANTHROPIC_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const messages = [
      {
        role: "user" as const,
        content: `You are an expert career coach and ATS specialist. Analyze this resume against the job description.

Resume:
${resume}

Job Description:
${jobDescription}

Return ONLY valid minified JSON. Do not wrap it in markdown. Do not include explanations before or after the JSON.

Use this exact JSON structure:
{
  "atsScore": <number 0-100>,
  "matchedKeywords": [<array of strings found in both resume and JD>],
  "missingKeywords": [<array of important JD keywords missing from resume>],
  "improvements": [<array of 3-5 specific actionable suggestions as strings>],
  "summary": "<2-3 sentence overall assessment>"
}`
      }
    ];

    let message: MessageResponse | null = null;
    let lastPermissionError: unknown;

    for (const model of getModelCandidates()) {
      try {
        message = await createMessage(
          {
            model,
            max_tokens: 1024,
            messages
          },
          process.env.ANTHROPIC_API_KEY
        );
        break;
      } catch (error) {
        if (error instanceof ProviderApiError && error.status === 403) {
          lastPermissionError = error;
          continue;
        }

        throw error;
      }
    }

    if (!message) {
      throw lastPermissionError;
    }

    const text =
      message.content[0]?.type === "text" ? message.content[0].text ?? "" : "";

    try {
      const result = parseResumeAnalysis(text);
      return NextResponse.json(result);
    } catch {
      return NextResponse.json(
        {
          code: "parse_error",
          error: "The model returned a response that was not valid JSON.",
          rawResponse: text.slice(0, 500)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const clientError = toClientError(error);

    return NextResponse.json(clientError.body, { status: clientError.status });
  }
}
