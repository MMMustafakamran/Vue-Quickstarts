# Vue-Quickstarts

QA harness for the Vue quickstart page of every CopilotKit agent framework (https://docs.copilotkit.ai/vue/<framework>). Findings: [FINDINGS.md](FINDINGS.md). Page status and clips: [assignment.json](assignment.json).

## Run

```bash
cp .env.example my-copilot-app/.env   # add OPENAI_API_KEY
(cd my-copilot-app && npm install) && (cd autorecorder && npm install)
./start-all.sh                         # Vite 5160, runtime server.ts 8160
cd autorecorder && npm run record -- --pages=quickstart-mastra
```

CI: `.github/workflows/daily.yml` (drift + versions plan, sharded recording, report artifact `run-<date>`).
