# DSA Learning Lab

An interactive, self-paced Data Structures & Algorithms course in **Java** for HNDIT students, written in simple **Tanglish** (Tamil sentence structure with English technical words). All questions, quizzes and exercises are in English.

The curriculum is built only from the attached lecture notes, practicals and past papers, plus one clearly labelled **beginner prep module** (Java basics) for students who have never programmed.

| # | Module | Source notes |
|---|--------|--------------|
| 0 | Java Basics for Absolute Beginners (prep) | extra, supports Practical 1 |
| 1 | Data Structures, Algorithms & ADTs | Lecture 2, 11, Assignment 1 |
| 2 | Arrays (1D, 2D, insert/delete) | Lecture 2, 4, Practical 1–2 |
| 3 | Java Collections & Generics | Lecture 4, 5 |
| 4 | Linked Lists | Practical 4 |
| 5 | Stacks | Lecture 7, Practical 5 |
| 6 | Queues & Circular Queues | Lecture 8, Week 8 sheet |
| 7 | Trees & Binary Search Trees | Lecture 3, 9 |
| 8 | Algorithm Analysis & Big O | Lecture 11 |
| 9 | Searching | Lecture 12, 13 |
| 10 | Sorting | Lecture 14, 15 |

Graphs are **not** included because they do not appear in any of the supplied notes.

Content: 39 lessons · 87 MCQs with Tanglish explanations · 33 short-answer questions · 33 Java coding exercises with hidden tests · 13 interactive visualizations.

## Features

Dashboard · Learn (curriculum) · Lesson pages (analogy → Tanglish → English term → visual → code → line-by-line → expected output → quick check) · Visual Lab · Java Playground · Coding Practice (Run + Submit with test cases) · MCQ quizzes (topic or mixed, shuffled, review, retry missed) · Short answers (AI-assisted or keyword fallback) · Revision Centre (missed questions, timed practice, definitions) · Progress · Settings (theme, export/import JSON, reset).

There is **no login and no database**. Progress is stored in the browser's `localStorage` only.

## Tech

React 19 + TypeScript (strict) + Vite + Tailwind CSS v4 · Monaco editor (with a plain-textarea fallback) · React Router (`HashRouter`, so every URL works on GitHub Pages) · Vitest.

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck
npm test             # unit + render tests
npm run build        # production build in dist/
npm run preview
```

### Verify every Java example with a real JDK (optional)

```bash
npm run verify:java  # needs javac + java (JDK 17+) on PATH
```

This compiles and runs **every** lesson program and **every** exercise solution against its expected output and test cases. It is how the shipped outputs were checked, and it caught a wrong output during development.

## How Java code runs

Browsers cannot run Java, and the site never evaluates student code itself. Code is sent to a remote execution service, **Judge0 CE** (`https://ce.judge0.com`, language id 91, Java 17), through its public API. If the service is offline, rate limited or the student is offline, the UI shows a clear error and **nothing is graded or faked**.

To use your own Judge0 instance set `VITE_JUDGE0_URL` (see below). The public instance is free and shared, so it may be slow or rate limited at busy times.

## Deploy to GitHub Pages

1. Push the project to a GitHub repository whose default branch is `main`.
2. In **Settings → Pages**, set *Source* to **GitHub Actions**.
3. (Optional, for AI feedback) add a repository **variable** `VITE_AI_WORKER_URL` under *Settings → Secrets and variables → Actions → Variables*. It is a public URL, not a secret.
4. Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs typecheck, tests, builds with `VITE_BASE=/<repo-name>/` and publishes `dist/`.

The site will be at `https://<user>.github.io/<repo-name>/`.

## Short-answer AI feedback (Cloudflare Worker + Groq)

AI feedback is optional. Without it, short answers use a deterministic keyword check and the UI says so.

The browser never sees the Groq key. It calls a small Cloudflare Worker ([`worker/`](worker)), which holds the key as a **secret** and forwards a strictly validated request to Groq.

```bash
cd worker
npm install -g wrangler        # or use npx
wrangler login
# 1. Edit wrangler.toml: set ALLOWED_ORIGINS to https://<your-user>.github.io (keep no trailing slash)
# 2. Store the key as a Worker secret (paste it when asked; it is never written to a file):
npx wrangler secret put GROQ_API_KEY
# 3. Deploy:
npx wrangler deploy
```

Wrangler prints the Worker URL (for example `https://dsa-ai-proxy.<subdomain>.workers.dev`). Put it in `VITE_AI_WORKER_URL` (repository variable for CI, or `.env` locally; see [`.env.example`](.env.example)).

For local Worker development create `worker/.dev.vars` (git-ignored) containing `GROQ_API_KEY=...` and run `npx wrangler dev`.

What the Worker enforces: only `POST /evaluate`; origin allow-list; request body and field size limits; per-IP rate limit; fixed model (`GROQ_MODEL`, default `llama-3.3-70b-versatile`); the student's answer is passed as quoted data to resist prompt injection; the model must return a JSON object that is validated again before it is returned (and once more in the browser).

**Never** put the Groq key in any `VITE_*` variable, in `.env`, in source code or in a commit. Anything prefixed `VITE_` is compiled into the public JavaScript bundle.

## Environment variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_BASE` | build | Base path (`/<repo>/` on GitHub Pages). Set by the workflow. |
| `VITE_AI_WORKER_URL` | build | Public URL of the Worker. Leave empty to disable AI feedback. |
| `VITE_JUDGE0_URL` | build | Optional. Defaults to `https://ce.judge0.com`. |
| `GROQ_API_KEY` | Worker **secret** only | Groq API key. Never in the frontend. |

## Honest limitations

- **This is a static site.** Answer keys, model answers and "hidden" test cases are shipped inside the JavaScript. A determined student can read them in the browser developer tools. The quizzes and exercises are for practice and learning, **not for secure exams**.
- **CORS is not authentication.** The Worker's origin allow-list stops other websites from using it in a browser, but anyone can call it directly with a script. The size limits and rate limit contain the cost; for stronger protection add Cloudflare rate-limiting rules or Turnstile.
- The Worker's rate limit is in-memory per isolate: it is a best-effort guard, not an exact quota.
- The keyword check for short answers cannot judge meaning; the AI check can be wrong. Both are labelled in the UI, and the model answer is always available.
- Progress lives in one browser. Clearing site data erases it unless it was exported.
- Live Java execution depends on a free public service (Judge0 CE). Self-host it for classroom-scale use.

## Troubleshooting

- **"Could not reach the Java runner"**: check the internet connection; try again in a minute (rate limit); or set `VITE_JUDGE0_URL` to another instance.
- **Editor shows a plain text box**: Monaco loads from a CDN. If it is blocked the app falls back to a basic editor that still works.
- **Blank page on GitHub Pages**: make sure the workflow built with `VITE_BASE=/<repo-name>/` (it does by default) and that Pages source is set to *GitHub Actions*.
- **AI feedback says "not configured"**: `VITE_AI_WORKER_URL` was empty at build time.
- **AI feedback says "temporarily unavailable"**: check `ALLOWED_ORIGINS` includes your exact site origin and that `GROQ_API_KEY` was set with `wrangler secret put`.

## Accessibility

Keyboard navigable with visible focus, skip link, semantic landmarks, labelled form controls, live regions for results, colour is never the only signal (labels and icons accompany colours), `prefers-reduced-motion` respected, light/dark themes with checked contrast.

---

Powered by [Asam Hussain](https://asamhussain.com)
