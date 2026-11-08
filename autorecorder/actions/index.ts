/**
 * Which handler serves which page id. Every page is a Vue quickstart (one per agent framework).
 */
import { type ActionContext, type PageActionHandler, type PageRecordConfig } from '../core/types';
import { type Page } from 'playwright';

import { waitForPageReady } from './page-ready';
import { runVueQuickstartAction } from './vueqs.actions';
import { FRAMEWORKS, pageId } from '../config/frameworks';

/** Keys are page ids from `config/pages.config.ts`. Doctor flags any orphans. */
export const ACTION_MAP: Record<string, PageActionHandler> = Object.fromEntries(
  FRAMEWORKS.map((f) => [pageId(f), runVueQuickstartAction]),
);

export async function executePageAction(
  page: Page,
  config: PageRecordConfig,
  rootPath: string,
  ctx: ActionContext,
): Promise<void> {
  // Vite serves modules lazily, so markup can be on screen before anything is wired to it.
  await waitForPageReady(page, { label: config.id });
  await ACTION_MAP[config.id](page, config, rootPath, ctx);
}
