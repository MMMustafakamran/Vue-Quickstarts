# Vue-Quickstarts

Docs QA harness for the **Vue quickstart of every agent framework** in the CopilotKit docs: https://docs.copilotkit.ai/vue/<framework> (the sidebar's "Quickstart"). LangGraph TypeScript and Google Antigravity are covered by LangGraph-vue and Antigravity-Vue. Doc code verbatim, one clip per framework page. The goal is to show doc defects; fixes that hide one are banned.

## Rules

`.qa/` is the vendored copy of the shared tooling and rules (filled by the sync script; never edit it here).

@.qa/instructions/QA-RULES.md
@.qa/instructions/AUTORECORDER.md
@.qa/instructions/VOICE.md
@.qa/instructions/REVIEW.md
@.qa/instructions/REPORT.md

## This repo

- The published Vue code is the same on all 18 pages (only link prefixes differ in the `.md` export), so ONE app serves every page: `my-copilot-app/` (`npm create vue@latest` + the doc's `server.ts`, `src/main.ts`, `src/App.vue`).
- Ports (`start-all.sh`): Vite **5160**, the doc's runtime `server.ts` **8160** (BuiltInAgent; doc 8200, set through `PORT`). Never 3000 / 8000. No framework backend: the page never shows one (FINDINGS.md #1).
- Key: `my-copilot-app/.env` (`OPENAI_API_KEY`, see `.env.example`). Never print or commit it.
- Pages: `autorecorder/config/frameworks.ts` (one entry per framework) → `pages.config.ts`. Built-in Agent (`/vue`) is a working take; the other 17 are level-1 takes (`actions/vueqs.actions.ts`: demo → live-page evidence → Notepad).
- `assignment.json` pages carry `sidebarRoot` (`vue/<framework>`): each quickstart sits in its own framework's sidebar, not in `/vue`'s (`drift.mjs` reads that sidebar for reachability).
- Narration: `narration/scripts/VUEQS-<framework>-01-Quickstart.json`, one template, framework name and ending varied.
