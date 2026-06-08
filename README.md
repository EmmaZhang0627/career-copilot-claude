# CareerCopilot

A bilingual AI career assistant for international students. The app includes a landing page and a resume analyzer powered by a server-side Claude-compatible API route.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/en`.

## Environment Variables

Create `.env.local`:

```env
ANTHROPIC_API_KEY=your_dmxapi_key
ANTHROPIC_BASE_URL=https://www.dmxapi.cn/v1
ANTHROPIC_MODEL=claude-sonnet-4-6
```

Do not prefix these with `NEXT_PUBLIC_`. They are used only by the server API route.
