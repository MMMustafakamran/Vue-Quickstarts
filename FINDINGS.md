# Findings — Vue quickstarts (all agent frameworks except LangGraph TypeScript and Google Antigravity)
Open doc defects only, for the sidebar "Quickstart" page of each framework under https://docs.copilotkit.ai/vue/<framework>. Numbers are stable IDs (`FINDINGS.md #N`); gaps are removed findings. Approved by the owner 2026-11-09.
Stack: `@copilotkit/vue`/`runtime`/`core` 1.85.0 (declared ^1.85.0), `vue` 3.5.45 (declared ^3.5.42), `vite` 8.3.6 (declared ^8.2.2), `tsx` 4.23.15, `typescript` 6.0.3, Node 26.7.0, npm 12.0.2, Windows 11 Pro. Docs: https://docs.copilotkit.ai/vue/<framework> (snapshot 2026-11-08, `doc-snapshot/`)

## Dev blockers (seen with `npm run dev` and normal use of the page)

### Vue Quickstart, 17 frameworks
  - [LangGraph (Python)](https://docs.copilotkit.ai/vue/langgraph-python)
  - [LangGraph (FastAPI)](https://docs.copilotkit.ai/vue/langgraph-fastapi)
  - [Google ADK](https://docs.copilotkit.ai/vue/google-adk)
  - [Mastra](https://docs.copilotkit.ai/vue/mastra)
  - [CrewAI Crews](https://docs.copilotkit.ai/vue/crewai-crews)
  - [Pydantic AI](https://docs.copilotkit.ai/vue/pydantic-ai)
  - [Claude Agent SDK (Python)](https://docs.copilotkit.ai/vue/claude-sdk-python)
  - [Claude Agent SDK (TypeScript)](https://docs.copilotkit.ai/vue/claude-sdk-typescript)
  - [Agno](https://docs.copilotkit.ai/vue/agno)
  - [AG2](https://docs.copilotkit.ai/vue/ag2)
  - [LlamaIndex](https://docs.copilotkit.ai/vue/llamaindex)
  - [Strands (Python)](https://docs.copilotkit.ai/vue/strands)
  - [Strands (TypeScript)](https://docs.copilotkit.ai/vue/strands-typescript)
  - [Microsoft Agent Framework (Python)](https://docs.copilotkit.ai/vue/ms-agent-python)
  - [Microsoft Agent Framework (.NET)](https://docs.copilotkit.ai/vue/ms-agent-dotnet)
  - [Microsoft Agent Harness (.NET)](https://docs.copilotkit.ai/vue/ms-agent-harness-dotnet)
  - [Deep Agents](https://docs.copilotkit.ai/vue/deepagents)

**#1 The Vue quickstart never connects the selected framework's agent, and the live page shows no Vue steps.**
- **Doc (rendered page):** the sidebar "Quickstart" links to the framework root `/vue/<framework>` (it loads as `?frontend=vue&backend=<framework>`; the page's own `/vue/<framework>/quickstart` link answers `307` back to it). In a browser it is the framework's landing page: "<Framework> and CopilotKit running together, in the React frontend.", with one code block, a Next.js `app/api/copilotkit/route.ts` (`createCopilotRuntimeHandler`, `export const GET = handler; export const POST = handler; …`). There is no `npm create vue`, no `@copilotkit/vue` and no `server.ts`. "Read the setup guide" goes back to the same page, or to a React quickstart (LangGraph Python/FastAPI → `/langgraph-python/quickstart`, ADK → `/google-adk/quickstart`, Strands → `/strands/quickstart`).
- **Doc (`.md` export):** the Vue steps exist only there, byte-identical for all 17 frameworks apart from link prefixes. `server.ts` registers `default: new BuiltInAgent({ model: "openai:gpt-6-luna", prompt: "You are a helpful assistant for a Vue app." })`, and its own callout says "Already have an agent? Do not use BuiltInAgent … use your framework's quickstart for the runtime wiring", which is React/Next.
- **Result:** following the `.md` steps verbatim gives a working chat answered by OpenAI through `BuiltInAgent` on every framework (`/api/copilotkit/info` reports `"className":"BuiltInAgent"`; probe reply e.g. "I'm ChatGPT, and I can't identify or disclose the underlying model or agent framework powering this app."). The framework's agent is never involved, and no Vue page shows how to register it in the standalone Node `server.ts` (`createCopilotNodeListener`). Wiring it needs guesswork.
- Same defect as LangGraph-vue #1/#2 and Antigravity-vue #9. The Built-in Agent Vue quickstart (https://docs.copilotkit.ai/vue) renders the Vue steps and works.

## Minor notes
- #2 `.md` "Where to go next": two links 404 on every framework page because the path is doubled, e.g. `/vue/mastra/vue/generative-ui/tool-based` and `/vue/mastra/vue/AG-UI-Streams`.
- #3 `export OPENAI_API_KEY=sk-...` is bash-only, with no Windows form.
- #4 `App.vue` hardcodes `http://localhost:8200/api/copilotkit` while `server.ts` honours `PORT`, so a port change means editing both.
- #5 The landing page's embedded live demo (`showcase-<framework>-production.up.railway.app/vue/agentic-chat`) returns `404` for 15 frameworks; Agno's works (a Vue showcase) and Deep Agents embeds a Loom video instead.
- #6 [Microsoft Agent Harness (.NET)](https://docs.copilotkit.ai/vue/ms-agent-harness-dotnet): the rendered page is the Microsoft Agent Framework landing page ("Bring your Microsoft Agent Framework agents into any app", "Build with Microsoft Agent Framework"), with no mention of Agent Harness in its headings.
