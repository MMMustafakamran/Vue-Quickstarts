/**
 * The 18 Vue quickstarts under test: one per agent framework in the docs' framework picker
 * (LangGraph TypeScript and Google Antigravity are tested in their own repos).
 * `slug` is the docs path under /vue/ ('' = the /vue root, Built-in Agent).
 * `landing` is the live page's "... in the React frontend" sentence (rendered page, 2026-11-08).
 */
export interface Framework {
  slug: string;
  name: string;
  /** Text drag-selected on the live page: its React wording. Empty for Built-in Agent (works). */
  landing: string;
}

export const FRAMEWORKS: Framework[] = [
  { slug: '', name: 'Built-in Agent', landing: '' },
  { slug: 'langgraph-python', name: 'LangGraph (Python)', landing: 'LangGraph and CopilotKit running together, in the React frontend.' },
  { slug: 'langgraph-fastapi', name: 'LangGraph (FastAPI)', landing: 'LangGraph and CopilotKit running together, in the React frontend.' },
  { slug: 'google-adk', name: 'Google ADK', landing: 'ADK and CopilotKit running together, in the React frontend.' },
  { slug: 'mastra', name: 'Mastra', landing: 'Mastra and CopilotKit running together, in the React frontend.' },
  { slug: 'crewai-crews', name: 'CrewAI Crews', landing: 'CrewAI and CopilotKit running together, in the React frontend.' },
  { slug: 'pydantic-ai', name: 'Pydantic AI', landing: 'Pydantic AI and CopilotKit running together, in the React frontend.' },
  { slug: 'claude-sdk-python', name: 'Claude Agent SDK (Python)', landing: 'The Claude Agent SDK and CopilotKit running together, in the React frontend.' },
  { slug: 'claude-sdk-typescript', name: 'Claude Agent SDK (TypeScript)', landing: 'The Claude Agent SDK and CopilotKit running together, in the React frontend.' },
  { slug: 'agno', name: 'Agno', landing: 'Agno and CopilotKit running together, in the React frontend.' },
  { slug: 'ag2', name: 'AG2', landing: 'AG2 and CopilotKit running together, in the React frontend.' },
  { slug: 'llamaindex', name: 'LlamaIndex', landing: 'LlamaIndex and CopilotKit running together, in the React frontend.' },
  { slug: 'strands', name: 'Strands (Python)', landing: 'Strands and CopilotKit running together, in the React frontend.' },
  { slug: 'strands-typescript', name: 'Strands (TypeScript)', landing: 'Strands and CopilotKit running together, in the React frontend.' },
  { slug: 'ms-agent-python', name: 'Microsoft Agent Framework (Python)', landing: 'The Microsoft Agent Framework and CopilotKit running together, in the React frontend.' },
  { slug: 'ms-agent-dotnet', name: 'Microsoft Agent Framework (.NET)', landing: 'The Microsoft Agent Framework and CopilotKit running together, in the React frontend.' },
  { slug: 'ms-agent-harness-dotnet', name: 'Microsoft Agent Harness (.NET)', landing: 'The Microsoft Agent Framework and CopilotKit running together, in the React frontend.' },
  { slug: 'deepagents', name: 'Deep Agents', landing: 'renders them as React components' },
];

/** Recorder page id: 'quickstart-<slug>' ('quickstart-built-in-agent' for the root). */
export const pageId = (f: Framework) => `quickstart-${f.slug || 'built-in-agent'}`;
/** Clip stem after the 'VUEQS-' prefix, as in assignment.json links[].clip. */
export const clipStem = (f: Framework) => `${f.slug || 'built-in-agent'}-01-Quickstart`;
