/**
 * Vue quickstart of every agent framework: https://docs.copilotkit.ai/vue/<framework> (the sidebar's
 * "Quickstart"). The published Vue code is the same on all 18 pages (FINDINGS.md #1), so ONE Vite app
 * (5160) and ONE doc runtime server.ts (8160, BuiltInAgent) serve every page; only the doc segment differs.
 * Built-in Agent (/vue) works: plain take. The other 17 are level-1 findings (actions/vueqs.actions.ts).
 */
import { definePages } from '../core/types';
import { FRAMEWORKS, clipStem, pageId } from './frameworks';

export const SKIP_RECORDING: Record<string, string> = {};

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
