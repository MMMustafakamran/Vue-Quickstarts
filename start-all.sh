#!/usr/bin/env bash
# HARNESS: starts the Vue-Quickstarts servers on harness ports (never 3000/8000).
#   8160 the doc's runtime server.ts (BuiltInAgent; doc: 8200, server.ts honours PORT)
#   5160 Vite (doc: 5173)
# The Vue quickstart's code is the same on all 18 framework pages (FINDINGS.md #1), so one app
# and one runtime serve every page. No framework backend: the page never shows one.
# Key: my-copilot-app/.env (OPENAI_API_KEY, see .env.example). Doc: "export OPENAI_API_KEY=sk-...".
cd "$(dirname "$0")"
mkdir -p logs
cd my-copilot-app
set -a; . ./.env; set +a
(PORT=8160 npx tsx server.ts > ../logs/runtime-8160.log 2>&1) &
(npm run dev > ../logs/vite-5160.log 2>&1) &
wait
