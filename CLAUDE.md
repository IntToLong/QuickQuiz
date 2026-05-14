# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # ESLint (next/core-web-vitals)
npm run test         # Run all tests with coverage
npm run test:watch   # Run tests in watch mode
```

Run a single test file:
```bash
npx jest __tests__/store/quizSlice.test.js
```

Environment: `GEMINI_API_KEY` must be set in `.env.local`.

## Architecture

### Quiz generation flow

1. User types a topic in `InputArea` on the home page and submits — this dispatches `openModal('newQuiz')`.
2. The `NewQuiz` modal form collects topic, difficulty, and question count, then POSTs to `/api/generate-quiz`.
3. The API route calls Gemini (`gemini-2.5-flash-lite`) with the structured prompt from `prompt.js`, which enforces strict JSON output.
4. The response is sanitized and validated via `safeParseJSON` → `isValidQuizObject` in `util/validation.js`.
5. On success, `addQuiz` is dispatched and the router navigates to `/quiz`.

### Redux state (`store/quizSlice.js`)

Three fields:
- `quiz` — the active quiz object: `{ title: string, questions: [{ question, options: string[4], answer, explanation }] }`
- `result` — array of answered questions accumulated during the quiz
- `activeModal` — `'newQuiz'` | `'result'` | `null`

`useQuizStats` (hook) derives `correct`, `incorrect`, and `percentage` from these without local state.

### Pages / routing

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.js` | Server component; renders `InputArea` |
| `/quiz` | `app/quiz/page.js` | Client component; redirects to `/` if `quiz` is empty |
| `/quiz/result` | `app/quiz/result/page.js` | Client component; redirects to `/` if both `result` and `quiz` are empty |

### Modal system

Modals are controlled entirely by `activeModal` in Redux. Two modal types exist: `'newQuiz'` (quiz creation form) and `'result'` (quick score summary during the quiz). The `Modal` component reads `activeModal` from the store; `openModal` / `closeModal` actions control visibility.

### Component conventions

Each component lives in its own directory (`components/<domain>/<name>/`) containing `<name>.js` and `<name>.module.css`. The `@/` path alias maps to the project root.

### Testing

Jest is configured via `next/jest` with `jsdom`. CSS Modules are proxied by `identity-obj-proxy`; static assets are handled by `__mocks__/fileMock.js`. Tests mirror the source structure under `__tests__/`.

## Codebase Overview

Next.js 15 (App Router) quiz generator powered by Google Gemini. Users provide a topic, difficulty, and question count; the server calls Gemini to produce a structured JSON quiz; Redux holds quiz and answer state in-memory (no persistence — refresh resets all state).

**Stack:** Next.js 15, React 19, Redux Toolkit, `@google/genai`, `react-transition-group`, `react-circular-progressbar`, Jest + Testing Library
**Structure:** `app/` (pages + API route), `components/` (by domain), `store/` (single slice), `hooks/`, `util/`

**Key files:**
- `app/api/generate-quiz/route.js` — Gemini API integration
- `store/quizSlice.js` — Single Redux slice managing all state
- `components/quiz/new-quiz/new-quiz.js` — Quiz configuration form
- `util/validation.js` — Response parsing and validation
- `hooks/useQuizStats.js` — Derived statistics selector

**Known gotchas:** `maxOutputTokens: 1200` may truncate >14 question quizzes; state is ephemeral (no persistence); modal closes on Escape but result modal also navigates home.

For detailed architecture, module guides, data flow diagrams, component hierarchy, and 16 documented gotchas see [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).
