import { type Locator, type Page } from 'playwright';
import { type ActionContext, type PageActionHandler, type PageRecordConfig } from '../core/types';
import { runStandardAction, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { getGlobalCursorPos, humanGlide, idleNudge, sleep } from '../core/overlays/cursor';
import { closeNotepad, openNotepad, typeInNotepad } from '../core/overlays/notepad';
import { clickTaskbarApp, ensureOverlays, waitForHydration } from '../core/overlays/taskbar';
import { glideTo } from './glide-click';
import { checkpoint, mark, probeText } from '../core/timeline';

import { humanizeNote } from '../core/overlays/note-style';
import { FRAMEWORKS, pageId, type Framework } from '../config/frameworks';
/** Notepad typing speed, same as the other repos (fast, like a quick jotted note). */
export const TYPING = { charDelayMs: 34, jitter: 0.65, thinkChance: 0.05 };

/**
 * Level-1 finding (FINDINGS.md #1), the same on all 17 framework pages: the sidebar "Quickstart"
 * opens the framework's React landing page (Next.js route.ts), and the Vue steps, which exist only
 * in the .md export, register OpenAI BuiltInAgent and never the framework's agent.
 * Notes are written plainly here; humanizeNote() applies the owner's hurried style (AUTORECORDER.md section 2).
 */
const finding = (f: Framework): string =>
  [
    `findings.md #1 - ${f.name} vue quickstart`,
    `the sidebar quickstart link opens the ${f.name} landing page and it says "${f.landing}"`,
    'the only code on it is a next.js app/api/copilotkit/route.ts with export const POST = handler',
    `the vue steps are only in the .md export (docs.copilotkit.ai/vue/${f.slug}.md)`,
    'and they register BuiltInAgent with openai:gpt-6-luna, never a ' + f.name + ' agent',
    'so the chat u just saw answered from openai, /api/copilotkit/info says className BuiltInAgent',
    `no page shows how to wire a ${f.name} agent into the vue server.ts`,
    'a reader cant get this framework running in vue from this page',
  ].join('\n');

export const FINDING_NOTES: Record<string, string> = Object.fromEntries(
  FRAMEWORKS.filter((f) => f.landing).map((f) => [pageId(f), finding(f)]),
);

export interface DocEvidence {
  /** Text inside the element to point at (matched against pre/code/p/li/h2/h3). */
  text: string;
  caption: string;
}

/** Captions are log-only (no on-page overlay). Texts checked against the RENDERED pages, not the .md. */
export const FINDING_EVIDENCE: Record<string, DocEvidence[]> = Object.fromEntries(
  FRAMEWORKS.filter((f) => f.landing).map((f) => [
    pageId(f),
    [
      { text: f.landing, caption: `The "Quickstart" for Vue opens the ${f.name} landing page - React, not Vue` },
      { text: 'export const POST = handler;', caption: 'The only code is a Next.js route.ts. The Vue steps (BuiltInAgent) exist only in the .md' },
    ],
  ]),
);

async function findEvidence(page: Page, text: string) {
  for (const sel of ['pre', 'code', 'p', 'li', 'h2', 'h3']) {
    const loc = page.locator(sel, { hasText: text }).last();
    if ((await loc.count()) > 0 && (await loc.isVisible().catch(() => false))) return loc;
  }
  const any = page.getByText(text, { exact: false }).first();
  if ((await any.count()) > 0 && (await any.isVisible().catch(() => false))) return any;
  return null;
}

/** Go back to the doc page and point at each defect, one by one. */
export async function showDocEvidence(page: Page, config: PageRecordConfig): Promise<void> {
  const items = FINDING_EVIDENCE[config.id];
  if (!items?.length) return;
  console.log(`   🔎 Showing the finding on the doc page (${items.length} spot(s))...`);
  await clickTaskbarApp(page, 'chrome').catch(() => {});
  // The demo's verdict is settled before this point. docs.copilotkit.ai can throw its own React
  // hydration error (#418), and the take's error collectors would blame the app for it, so they
  // are detached before the doc revisit (Antigravity FINDINGS.md #48).
  page.removeAllListeners('pageerror');
  page.removeAllListeners('console');
  await page.goto(config.docUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await ensureOverlays(page, 'chrome');
  await waitForHydration(page, 8000).catch(() => false);
  // tsx keepNames wraps inner functions in __name(); define it so page.evaluate bodies run.
  await page.evaluate('window.__name = window.__name || ((f) => f)');
  await sleep(1500);

  for (const item of items) {
    const target = await findEvidence(page, item.text);
    void checkpoint('evidence', `doc shows "${item.text}"`, () => (target ? probeText(target) : null));
    if (!target) {
      console.warn(`   ⚠️ Evidence not found on the doc page: "${item.text}"`);
      continue;
    }
    mark('evidence', item.text);
    console.log(`   👉 ${item.caption}`);
    await wheelIntoView(page, target, item.text);
    await dragSelect(page, target, item.text);
    // Rest on the highlighted text the way a person pauses while pointing something out.
    for (let i = 0; i < 3; i++) {
      await sleep(900);
      await idleNudge(page);
    }
  }
}

/**
 * Scroll the way a person does: cursor over the page, mouse-wheel in short bursts with pauses,
 * until the target sits in the middle of the screen. No injected UI, no programmatic jump.
 */
async function wheelIntoView(page: Page, target: Locator, text?: string): Promise<void> {
  await humanGlide(page, 760, 520);
  // Stop when the wheel no longer moves anything (end of the page, and the block under the
  // cursor scrolled as far as it goes): otherwise a target near the bottom sits still on
  // camera for the whole loop. A code block scrolling under the cursor counts as movement.
  let lastScroll = Number.NaN;
  let stalls = 0;
  for (let i = 0; i < 50; i++) {
    const box = await target.boundingBox().catch(() => null);
    if (!box) break;
    // Steer by the exact text when given: code blocks scroll on their own, so the line can sit
    // far below the block's top. Keeping the cursor over the block makes the wheel scroll the
    // block first, then the page, the same as a person scrolling over it.
    const textY = text ? await textCentreY(target, text) : null;
    const centre = textY ?? box.y + Math.min(box.height, 120) / 2;
    const overX = box.x + Math.min(box.width / 2, 260);
    const overY = Math.min(Math.max(box.y + 40, 160), Math.min(box.y + box.height - 20, 900));
    const { x, y } = getGlobalCursorPos();
    if (Math.abs(x - overX) > 60 || Math.abs(y - overY) > 60) await humanGlide(page, overX, overY);
    const off = centre - 470;
    if (Math.abs(off) < 140) break;
    const scrolled = await scrollTotalAt(page);
    stalls = Math.abs(scrolled - lastScroll) < 2 ? stalls + 1 : 0;
    if (stalls >= 2) break;
    lastScroll = scrolled;
    const burst = Math.sign(off) * Math.min(Math.abs(off), 300 + Math.random() * 200);
    const notches = Math.max(2, Math.round(Math.abs(burst) / 100));
    for (let n = 0; n < notches; n++) {
      await page.mouse.wheel(0, burst / notches);
      await sleep(35 + Math.random() * 45);
    }
    await sleep(250 + Math.random() * 450);
  }
  await sleep(600);
}

/** Page scroll plus the scroll of every scrollable box under the cursor (plain loop: see locateText). */
async function scrollTotalAt(page: Page): Promise<number> {
  const { x, y } = getGlobalCursorPos();
  return page
    .evaluate(
      (p) => {
        let total = window.scrollY;
        for (let el = document.elementFromPoint(p.x, p.y); el; el = el.parentElement) total += el.scrollTop;
        return total;
      },
      { x, y },
    )
    .catch(() => Number.NaN);
}

interface TextSpan { sx: number; sy: number; ex: number; ey: number }

/**
 * Viewport position of `text` inside `target`: first and last character. Code blocks can hold
 * more than one copy of the code (one per colour theme, the others hidden), so every match is
 * tried and the first one that is actually rendered wins.
 */
async function locateText(target: Locator, text: string): Promise<TextSpan | null> {
  // Plain loops only: tsx wraps nested named functions in a `__name` helper that does not exist
  // inside the page, which made this evaluate throw and silently fall back.
  return target
    .evaluate((el, needle) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      let full = '';
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        nodes.push(n as Text);
        full += (n as Text).data;
      }
      for (let at = full.indexOf(needle); at >= 0; at = full.indexOf(needle, at + 1)) {
        const rects: DOMRect[] = [];
        for (const pos of [at, at + needle.length - 1]) {
          let acc = 0;
          for (const node of nodes) {
            if (pos < acc + node.data.length) {
              const r = document.createRange();
              r.setStart(node, pos - acc);
              r.setEnd(node, Math.min(pos - acc + 1, node.data.length));
              const b = r.getBoundingClientRect();
              if (b.width > 0 && b.height > 0) rects.push(b);
              break;
            }
            acc += node.data.length;
          }
        }
        if (rects.length === 2) {
          const [s, e] = rects;
          return { sx: s.left + 1, sy: s.top + s.height / 2, ex: e.right - 1, ey: e.top + e.height / 2 };
        }
      }
      return null;
    }, text)
    .catch((err) => {
      console.warn(`   ⚠️ locateText failed: ${String(err).slice(0, 160)}`);
      return null;
    });
}

async function textCentreY(target: Locator, text: string): Promise<number | null> {
  return (await locateText(target, text))?.sy ?? null;
}

/**
 * Highlight `text` inside `target` with a real mouse drag (press at its first character,
 * drag to its last, release), so the browser's own text selection marks the faulty snippet.
 * Falls back to the element's first line when the exact text can't be located.
 */
async function dragSelect(page: Page, target: Locator, text: string): Promise<void> {
  let pts = await locateText(target, text);
  if (!pts) {
    console.warn(`   ⚠️ Exact text not rendered, selecting the element's first line: "${text}"`);
    const b = await target.boundingBox();
    if (!b) return;
    pts = { sx: b.x + 4, sy: b.y + 12, ex: Math.min(b.x + b.width - 4, b.x + 700), ey: b.y + 12 };
  }
  await humanGlide(page, pts.sx - 3, pts.sy);
  await sleep(300 + Math.random() * 300);
  await page.mouse.down();
  await humanGlide(page, pts.ex + 2, pts.ey, 34);
  await sleep(120);
  await page.mouse.up();
}

export async function writeFinding(page: Page, config: PageRecordConfig): Promise<void> {
  await showDocEvidence(page, config).catch((e) => console.warn(`   ⚠️ Doc evidence step failed: ${String(e).slice(0, 120)}`));
  const body = FINDING_NOTES[config.id];
  if (!body) return;
  mark('notepad');
  await openNotepad(page, `finding-${config.id}.txt`);
  await typeInNotepad(page, humanizeNote(body), TYPING);
  await closeNotepad(page, 4000);
  mark('notepad-closed');
}

/**
 * A Vue quickstart take: the doc's chat on BuiltInAgent (it answers), then, for the 17 framework
 * pages, back to the live doc (React wording + Next.js route.ts) and the Notepad note.
 * Built-in Agent (/vue) is a plain working take.
 */
export const runVueQuickstartAction: PageActionHandler = async (page, config, root, ctx) => {
  const isFinding = Boolean(FINDING_NOTES[config.id]);
  try {
    await runStandardAction(page, config, root, ctx);
    if (isFinding) {
      // The chat working is expected: the defect is which agent answers (BuiltInAgent, not the framework).
      const info = await page
        .evaluate(() => fetch('http://localhost:8160/api/copilotkit/info').then((r) => r.text()).catch(() => ''))
        .catch(() => '');
      if (!/"className":"BuiltInAgent"/.test(info)) ctx.warn('runtime /info did not report BuiltInAgent');
      ctx.warn('FINDINGS.md #1: the Vue quickstart answers through BuiltInAgent (OpenAI), never the framework agent; the live page shows React/Next.js.');
    }
  } finally {
    if (isFinding) await writeFinding(page, config);
  }
};

// humanizeNote: the shared hurried Notepad style lives in core/overlays/note-style.ts (AUTORECORDER.md section 2).
export { humanizeNote };
