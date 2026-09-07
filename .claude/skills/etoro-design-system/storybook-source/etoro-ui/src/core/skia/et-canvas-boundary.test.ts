import { readdirSync, readFileSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const REPO_ROOT = resolve(__dirname, '../../../../..');
const SOURCE_ROOTS = ['apps', 'libs'].map((directory) => resolve(REPO_ROOT, directory));
const ET_CANVAS_IMPLEMENTATION = 'libs/etoro-ui/src/core/skia/et-canvas.tsx';

const EXPECTED_SURFACES = [
  'apps/etoro-mobile/src/components/common/tori-fab.tsx',
  'libs/etoro-ui/src/components/data-display/line-chart/et-line-chart.tsx',
  'libs/etoro-ui/src/components/instrument-island/subcomponents/island-glow.tsx',
  'libs/etoro-ui/src/foundations/text/et-blurred-text/et-blurred-text.tsx',
  'libs/features/club/subscription-management/rn/src/ui/components/glow-oval/club-subscription-management-glow-oval.component.tsx',
  'libs/features/market/asset-page/rn/src/ui/components/ai-cards/ai-card/gradient-border.tsx',
  'libs/features/market/asset-page/rn/src/ui/components/ai-cards/glow-oval.tsx',
  'libs/features/market/asset-page/rn/src/ui/components/peer-comparison-section/components/peer-comparison-chart-blocked.tsx',
  'libs/features/torii/rn/src/ui/components/tori-lottie/tori-lottie.component.tsx',
  'libs/features/torii/rn/src/ui/screens/torii-disclaimer-screen/torii-disclaimer-hero.component.tsx',
].sort();

const IMPERATIVE_SURFACE_GUARDS: Record<string, RegExp> = {
  'libs/etoro-ui/src/components/data-display/line-chart/et-line-chart.tsx': /useSkiaRuntime\(\)/,
  'libs/etoro-ui/src/components/instrument-island/subcomponents/island-glow.tsx': /useSkiaReady\(\)/,
  'libs/etoro-ui/src/foundations/text/et-blurred-text/et-blurred-text.tsx': /useSkiaReady\(\)/,
  'libs/features/market/asset-page/rn/src/ui/components/peer-comparison-section/components/peer-comparison-chart-blocked.tsx': /useSkiaReady\(\)/,
  'libs/features/torii/rn/src/ui/components/tori-lottie/tori-lottie.component.tsx': /useSkiaReady\(\)/,
};

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    if (!path.endsWith('.tsx') || /\.(?:spec|test)\.tsx$/.test(path)) return [];
    return [path];
  });
}

describe('Skia surface boundary', () => {
  const sources = SOURCE_ROOTS.flatMap(sourceFiles);
  const surfaceFiles = sources
    .filter((path) => path !== resolve(REPO_ROOT, ET_CANVAS_IMPLEMENTATION))
    .filter((path) => /\bEtCanvas\b/.test(readFileSync(path, 'utf8')))
    .map((path) => relative(REPO_ROOT, path))
    .sort();

  it('keeps the complete production surface inventory behind EtCanvas', () => {
    expect(surfaceFiles).toEqual(EXPECTED_SURFACES);

    for (const relativePath of surfaceFiles) {
      const source = readFileSync(resolve(REPO_ROOT, relativePath), 'utf8');
      expect(source).not.toMatch(/import\s*\{[^}]*\bCanvas\b[^}]*\}\s*from\s*['"]@shopify\/react-native-skia['"]/s);
    }
  });

  it('guards every surface that performs imperative Skia work during render', () => {
    for (const [relativePath, guard] of Object.entries(IMPERATIVE_SURFACE_GUARDS)) {
      expect(readFileSync(resolve(REPO_ROOT, relativePath), 'utf8')).toMatch(guard);
    }
  });
});
