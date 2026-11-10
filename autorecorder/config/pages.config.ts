/**
 * Vue quickstart of every agent framework: https://docs.copilotkit.ai/vue/<framework> (the sidebar's
 * "Quickstart"). The published Vue code is the same on all 18 pages (FINDINGS.md #1), so ONE Vite app
 * (5160) and ONE doc runtime server.ts (8160, BuiltInAgent) serve every page; only the doc segment differs.
 * Built-in Agent (/vue) works: plain take. The other 17 are level-1 findings (actions/vueqs.actions.ts).
 */
import { definePages } from '../core/types';
import { FRAMEWORKS, clipStem, pageId } from './frameworks';

// Owner, 2026-11-10: only the BuiltInAgent quickstart is built for Vue; the others are reported as text.
export const SKIP_RECORDING: Record<string, string> = {
  'quickstart-langgraph-python': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-langgraph-fastapi': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-google-adk': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-mastra': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-crewai-crews': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-pydantic-ai': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-claude-sdk-python': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-claude-sdk-typescript': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-agno': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-ag2': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-llamaindex': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-strands': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-strands-typescript': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-ms-agent-python': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-ms-agent-dotnet': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-ms-agent-harness-dotnet': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
  'quickstart-deepagents': 'Not built for Vue yet: the page shows the React landing page (owner, 2026-11-10). Drift is still checked; record again once the doc is fixed.',
};

export const PAGES = definePages(
  FRAMEWORKS.map((f) => ({
    id: pageId(f),
    name: `${f.name} - Vue quickstart`,
    videoName: 'Quickstart',
    videoFile: clipStem(f),
    docPath: f.slug,
    route: '',
    ideFile: 'my-copilot-app/server.ts',
    startLine: 1,
    endLine: 26,
    extraTabs: [
      { filePath: 'my-copilot-app/src/main.ts', startLine: 1, endLine: 5 },
      { filePath: 'my-copilot-app/src/App.vue', startLine: 1, endLine: 14 },
      { filePath: 'my-copilot-app/package.json', startLine: 13, endLine: 17 },
    ],
    prompt: 'Which agent framework are you?',
    waitAfterPromptMs: 3000,
  })),
);
