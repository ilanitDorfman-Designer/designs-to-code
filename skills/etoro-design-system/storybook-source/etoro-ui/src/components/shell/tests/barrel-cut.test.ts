import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// A static import, so the family's module scope really is evaluated by this suite.
import { EtAppLayout, EtSideMenu, EtTopPanel } from '../index';

const ROOT_BARREL = join(__dirname, '..', '..', '..', 'index.ts');

/**
 * The app frame is web-only and is reached through `etoro-ui/shell`. Putting any of it back in the
 * root barrel puts it back in the native bundle: the barrel is not tree-shaken and Metro compiles
 * its re-exports to eager requires, so every one of its ~1,600 importers pulls the whole family in
 * and executes its module scope at app boot.
 *
 * Convention was the only thing holding that, and conventions do not survive a merge. Two importers
 * are value imports in plain `.tsx` outside `app/`, and the frame calls bare `window.open`, so a bad
 * import is a native crash rather than only bundle weight.
 */
describe('the app frame stays out of the root barrel', () => {
  const barrel = readFileSync(ROOT_BARREL, 'utf8');

  it.each(['app-layout', 'side-menu', 'top-panel'])('GIVEN the root barrel THEN it does not re-export %s', (family) => {
    expect(barrel).not.toContain(`components/shell/${family}`);
  });

  it.each(['EtAppLayout', 'EtSideMenu', 'EtTopPanel'])('GIVEN the root barrel THEN it does not export %s', (name) => {
    expect(barrel).not.toMatch(new RegExp(`\\b${name}\\b`));
  });
});

/**
 * The second job the deleted `module-eval.test.ts` was doing, kept: this suite runs under the RN
 * preset, so importing the whole family here proves its module scope touches no DOM globals. That is
 * also what justifies the three native no-op stub pairs — without it, "this family is safe to
 * evaluate on native" is an assumption rather than a guarded fact.
 */
describe('the app frame evaluates in a DOM-less environment', () => {
  it('GIVEN the RN preset THEN there is no document to accidentally touch', () => {
    expect((globalThis as { document?: unknown }).document).toBeUndefined();
  });

  it('GIVEN the whole family is imported THEN nothing throws and the compound surface is there', () => {
    expect(EtAppLayout).toBeDefined();
    expect(EtAppLayout.SideMenu.__SLOT_TYPE).toBe('side-menu');
    expect(EtAppLayout.TopPanel.__SLOT_TYPE).toBe('top-panel');
    expect(EtAppLayout.Main.__SLOT_TYPE).toBe('main');
    expect(EtAppLayout.Aside.__SLOT_TYPE).toBe('aside');
    expect(EtSideMenu).toBeDefined();
    expect(EtTopPanel).toBeDefined();
  });
});
