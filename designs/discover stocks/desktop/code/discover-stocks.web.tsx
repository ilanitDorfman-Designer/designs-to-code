/**
 * Discover Stocks — Desktop
 * ---------------------------------------------------------------------------
 * Desktop conversion of the mobile "Discover Stocks" screen
 * (Figma file `fiNRek0eNjI0D7VGp9bgnn`, node 48:12146).
 *
 * Pattern-matched against eToro's real, shipped Watchlist mobile↔desktop pair
 * (closest precedent: both are dense, full-width instrument-table screens,
 * not dashboard-style screens with a persistent summary panel — see
 * `desktop-layout.md`'s "General padding & spacing" section, which documents
 * this exact default/short-panel decision from the real Home/Portfolio vs.
 * Watchlist screens). Concretely, this file carries forward:
 *   - Left Side Menu (collapsed, 80px) — required on every desktop page.
 *   - Top bar - desktop (same `EtTopbar` component as mobile, different slot
 *     content: Search field + "Ask Tori" action in the middle, notification
 *     bell in the end slot — see `figma-component-index.md`'s "Desktop
 *     replacements" table and `component-tiers.md`'s Top bar row).
 *   - No Right Panel — Watchlist (dense data) omits it; only Home/Portfolio
 *     (dashboard-style) include it. Discover Stocks is dense data, so it's
 *     dropped here too, not fabricated.
 *   - The same 3 data columns the mobile screen actually shows (Asset,
 *     Change 1D, 52W Range), stretched to the wider desktop row — NOT the
 *     extra columns (Sentiment, Market Cap, Div. Yield, P/E, Volume, Analyst
 *     Rating) the real Watchlist desktop adds. Those aren't present in the
 *     Discover Stocks mobile source, so — matching the Home pair's "missing
 *     feed posts" precedent — this build carries the mobile screen's real
 *     content forward rather than inventing new columns. Flagged in
 *     coverage-report.md as an open question, not silently resolved either way.
 *
 * Component tiers used in this file (see coverage-report.md for the full
 * breakdown and Tier C gaps):
 *   Tier A — EtButton, EtIconV2, EtSection (Title/SelectTitle), EtRange
 *   Tier B — EtTopbar, EtSearchInput, EtAssetItem (flagged inline below)
 *   Tier C (NOT used in code, Figma-only) — Left Side Menu. See the
 *     `navPlaceholder` View below: a plain, unstyled spacer reserving the
 *     Left Side Menu's real collapsed width (80px) so the rest of the layout
 *     math is honest — it is NOT a fabricated nav-rail component (no icons,
 *     no nav items, no visual chrome of its own).
 *
 * Real UI copy in this file (search placeholder, accessibility labels, empty
 * state) was written by the `content-writer` subagent against eToro's Voice &
 * Style Guide — see README.md (project root of this design) for the source strings.
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// Real etoro-ui imports — public package surface (see ui-kit.ui.md), real
// prop APIs read directly from each component's own source under
// storybook-source/etoro-ui/src/ (never invented/guessed).
import { EtAssetItem } from '@etoroplus/etoro-ui'; // Tier B — components/list/asset-item
import { EtButton } from '@etoroplus/etoro-ui'; // Tier A — components/button
import { EtIconV2 } from '@etoroplus/etoro-ui'; // Tier A — components/et-icon-v2
import { EtRange } from '@etoroplus/etoro-ui'; // Tier A — components/status/et-range
import { EtSearchInput } from '@etoroplus/etoro-ui'; // Tier B — components/input/search-input
import { EtSection } from '@etoroplus/etoro-ui'; // Tier A — components/layout/section
import { EtText } from '@etoroplus/etoro-ui'; // Tier A (foundation) — foundations/text
import { EtTopbar } from '@etoroplus/etoro-ui'; // Tier B — components/topbar (same component as mobile; desktop slot content only)
import { useEtoroTheme } from '@etoroplus/etoro-ui'; // core/hooks/use-etoro-theme — real theme-color access pattern (see et-button.tsx)
import { X1, X2, X3, X4, X6, X20 } from '@etoroplus/etoro-ui/core/styles/spacing'; // design-tokens.md spacing scale

// -----------------------------------------------------------------------
// Real bundled logo assets (assets/images/ — see references/assets.md).
// The live instrument-logo CDN (`etoro-cdn.etorostatic.com/market-avatars/
// {instrumentId}/...`) is the documented first choice, but assets.md flags a
// known gap: there's no ticker→instrumentId lookup available yet, so an ID
// can't be produced without guessing one. Falling back to the real bundled
// static files for these well-known tickers, per assets.md's own fallback
// rule — flagged in coverage-report.md, not silently resolved.
// -----------------------------------------------------------------------
const logo = (file: string) => `../../../../.claude/skills/etoro-design-system/assets/images/${file}`;

type Sentiment = 'positive' | 'negative';

interface StockRow {
  symbol: string;
  name: string;
  logoSource: string;
  change: string;
  sentiment: Sentiment;
  rangeLow: number;
  rangeHigh: number;
  rangeValue: number;
}

const STOCKS: StockRow[] = [
  { symbol: 'AAPL', name: 'Apple Inc', logoSource: logo('Aapl.png'), change: '1.42 (0.72%)', sentiment: 'positive', rangeLow: 164.08, rangeHigh: 260.1, rangeValue: 198.42 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', logoSource: logo('Nvda.png'), change: '4.85 (3.98%)', sentiment: 'positive', rangeLow: 39.23, rangeHigh: 212.19, rangeValue: 176.02 },
  { symbol: 'TSLA', name: 'Tesla Inc', logoSource: logo('Tsla.png'), change: '3.21 (-1.29%)', sentiment: 'negative', rangeLow: 138.8, rangeHigh: 488.54, rangeValue: 246.1 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', logoSource: logo('msft.png'), change: '0.98 (0.41%)', sentiment: 'positive', rangeLow: 385.58, rangeHigh: 555.45, rangeValue: 512.3 },
  { symbol: 'GOOG', name: 'Alphabet Inc', logoSource: logo('Goog.png'), change: '1.10 (-0.58%)', sentiment: 'negative', rangeLow: 130.67, rangeHigh: 207.05, rangeValue: 175.8 },
  { symbol: 'SPOT', name: 'Spotify Technology', logoSource: logo('Spotify.png'), change: '2.30 (1.15%)', sentiment: 'positive', rangeLow: 260.15, rangeHigh: 780.0, rangeValue: 610.4 },
  { symbol: 'PYPL', name: 'PayPal Holdings', logoSource: logo('pypl.png'), change: '0.44 (-0.61%)', sentiment: 'negative', rangeLow: 55.31, rangeHigh: 92.72, rangeValue: 64.2 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', logoSource: logo('AMD.png'), change: '1.75 (1.02%)', sentiment: 'positive', rangeLow: 76.48, rangeHigh: 240.61, rangeValue: 214.9 },
  { symbol: 'ADBE', name: 'Adobe Inc', logoSource: logo('ADBE.png'), change: '0.56 (0.11%)', sentiment: 'positive', rangeLow: 332.01, rangeHigh: 587.75, rangeValue: 358.6 },
  { symbol: 'ADSK', name: 'Autodesk Inc', logoSource: logo('adsk.png'), change: '0.89 (-0.34%)', sentiment: 'negative', rangeLow: 205.55, rangeHigh: 342.32, rangeValue: 268.4 },
  { symbol: 'SNAP', name: 'Snap Inc', logoSource: logo('snap.png'), change: '0.12 (-1.04%)', sentiment: 'negative', rangeLow: 6.42, rangeHigh: 17.33, rangeValue: 8.9 },
];

// Real desktop breakpoint constants — desktop-layout.md's documented
// per-breakpoint values (see "Breakpoint-by-breakpoint reference" and
// "General padding & spacing", the latter taken from the real shipped
// Home/Portfolio/Watchlist screens rather than the abstract grid page).
const LEFT_MENU_COLLAPSED_WIDTH = X20; // 80px — Left Side Menu Collapsed state (default on every desktop page)
const TOP_BAR_HEIGHT = 84; // matches desktop-layout.md's 1920px/1440px/1366px/1280px rows
// No Right Panel on this screen (dense-data pattern, see file header note) —
// so desktop-layout.md's 12px Content↔Right Panel gap token doesn't apply here.

type ViewState = 'default' | 'empty' | 'error';

export function DiscoverStocksDesktop() {
  const [search, setSearch] = useState('');
  // Demo-only toggle so the empty/error copy (written by content-writer,
  // see README.md (project root of this design)) is visible in this prototype without wiring real
  // data fetching — not a real API integration.
  const [viewState, setViewState] = useState<ViewState>('default');

  // Real theme-color access pattern (see et-button.tsx / et-search-input.tsx)
  // rather than a static color import, so the screen follows the active
  // light/dark theme instead of hardcoding one.
  const { colors } = useEtoroTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundBase }]}>
      {/*
        Tier C gap: Left Side Menu (nav rail) — required on every desktop
        page per desktop-layout.md's "Global requirement" section, but it has
        NO Storybook implementation (confirmed in component-tiers.md: no
        side-menu/left-menu folder anywhere in storybook-source/etoro-ui/src/).
        This is a plain, unstyled spacer reserving its real Collapsed width
        (80px) so the rest of the page's layout math is honest — it is not a
        fabricated menu (no icons, no nav items, no borders/background of its
        own). See coverage-report.md.
      */}
      <View style={styles.navPlaceholder} accessibilityElementsHidden accessible={false} />

      <View style={styles.mainColumn}>
        {/*
          Top bar - desktop: the SAME EtTopbar component used on mobile,
          just composed with desktop-appropriate slot content (search field +
          "Ask Tori" action in the middle, notification bell in the end slot)
          instead of mobile's back button + "Stocks" title + actions — see
          component-tiers.md's Top bar row and figma-component-index.md's
          "Desktop replacements" table. Resized to the available width
          (screen width minus the nav rail), per workflow-code-and-figma.md's
          hard constraint on full-width chrome.
        */}
        <EtTopbar style={[styles.topbar, { borderBottomColor: colors.dividerPrimary }]}>
          <EtTopbar.Middle style={styles.topbarMiddle}>
            <EtSearchInput
              variant="compact"
              value={search}
              onChangeText={setSearch}
              placeholder="Search assets"
              containerStyle={styles.searchInput}
              testID="discover-stocks-search"
            />
            <EtButton variant="primary-subtle" size="medium" onPress={() => {}}>
              <EtButton.IconV2 name="sparkles-light" />
              <EtButton.Label>Ask Tori</EtButton.Label>
            </EtButton>
          </EtTopbar.Middle>
          <EtTopbar.End>
            <EtTopbar.Action accessibilityLabel="Notifications" onPress={() => {}}>
              <EtIconV2 name="bell-ring" size="lg" />
            </EtTopbar.Action>
          </EtTopbar.End>
        </EtTopbar>

        {/* Context area — "All" market picker + table utility actions, same
            content as mobile's context row, just anchored at the full
            available row width instead of a 375px mobile viewport. */}
        <View style={styles.contextRow}>
          <EtSection>
            <EtSection.SelectTitle text="All" onPress={() => {}} accessibilityLabel="All markets. Double tap to change market." />
          </EtSection>
          <View style={styles.contextActions}>
            <EtButton variant="info-ghost" size="small" onPress={() => {}} accessibilityLabel="Customize Columns">
              <EtButton.IconV2 name="columns" />
            </EtButton>
            <EtButton variant="info-ghost" size="small" onPress={() => setViewState('empty')} accessibilityLabel="Filter Stocks">
              <EtButton.IconV2 name="filter" />
            </EtButton>
          </View>
        </View>

        {/* Table header row — same 3 columns as the mobile source (Asset,
            Change 1D, 52W Range). Deliberately NOT extended with the extra
            columns (Sentiment, Market Cap, Div. Yield, P/E, Volume, Analyst
            Rating) the real Watchlist desktop adds — see file header note
            and coverage-report.md. */}
        <View style={[styles.tableHeaderRow, { borderBottomColor: colors.dividerPrimary }]}>
          <EtText variant="label-tertiary-semibold" style={[styles.colAsset, { color: colors.textTertiaryNeutral }]}>
            Asset
          </EtText>
          <EtText variant="label-tertiary-semibold" style={[styles.colChange, { color: colors.textTertiaryNeutral }]}>
            Change 1D
          </EtText>
          <EtText variant="label-tertiary-semibold" style={[styles.colRange, { color: colors.textTertiaryNeutral }]}>
            52w Range
          </EtText>
        </View>

        {viewState === 'default' && (
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {STOCKS.map((stock, index) => (
              <EtAssetItem
                key={stock.symbol}
                size="large"
                onPress={() => {}}
                accessibilityLabel={`${stock.symbol}, ${stock.name}`}
                style={styles.row}
              >
                <EtAssetItem.Logo source={stock.logoSource} accessibilityLabel={`${stock.name} logo`} />
                <EtAssetItem.Content>
                  <EtAssetItem.Symbol>{stock.symbol}</EtAssetItem.Symbol>
                  <EtAssetItem.Name>{stock.name}</EtAssetItem.Name>
                </EtAssetItem.Content>
                <EtAssetItem.Change value={stock.change} sentiment={stock.sentiment} />
                <EtAssetItem.Trailing>
                  <View style={styles.rangeCell}>
                    <EtRange
                      min={stock.rangeLow}
                      max={stock.rangeHigh}
                      value={stock.rangeValue}
                      cursorColor={stock.sentiment === 'negative' ? 'red' : 'green'}
                      width={180}
                      formatValue={(value) => `$${value.toFixed(2)}`}
                    />
                  </View>
                </EtAssetItem.Trailing>
                {index < STOCKS.length - 1 && <EtAssetItem.Divider />}
              </EtAssetItem>
            ))}
          </ScrollView>
        )}

        {/*
          Empty / error states — "Empty state" has no Storybook implementation
          (Tier C, Figma-only: see component-tiers.md's "Not found in
          Storybook" table). Composed here from real Tier A primitives
          (EtText, EtButton) only — never a fabricated "EmptyState" component.
          Copy from the content-writer subagent (see README.md (project root of this design)).
        */}
        {viewState === 'empty' && (
          <View style={styles.stateContainer}>
            <EtText variant="heading-base" style={{ color: colors.textPrimaryNeutral }}>
              No matches found
            </EtText>
            <EtText variant="body-secondary-regular" style={[styles.stateBody, { color: colors.textTertiaryNeutral }]}>
              Try a different search term or adjust your filters.
            </EtText>
            <EtButton variant="info-ghost" size="medium" onPress={() => setViewState('default')}>
              <EtButton.Label>Clear filters</EtButton.Label>
            </EtButton>
          </View>
        )}

        {viewState === 'error' && (
          <View style={styles.stateContainer}>
            <EtText variant="heading-base" style={{ color: colors.textPrimaryNeutral }}>
              We couldn&apos;t load stocks
            </EtText>
            <EtText variant="body-secondary-regular" style={[styles.stateBody, { color: colors.textTertiaryNeutral }]}>
              Try refreshing the page.
            </EtText>
            <EtButton variant="primary-filled" size="medium" onPress={() => setViewState('default')}>
              <EtButton.Label>Try Again</EtButton.Label>
            </EtButton>
          </View>
        )}
      </View>
    </View>
  );
}

// Structural (non-color) styles only — colors come from useEtoroTheme() at
// the call site above, so this screen follows the active light/dark theme
// instead of a hardcoded palette (see et-button.tsx / et-search-input.tsx
// for the same real pattern).
const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 900,
  },
  navPlaceholder: {
    width: LEFT_MENU_COLLAPSED_WIDTH,
    alignSelf: 'stretch',
  },
  mainColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  topbar: {
    height: TOP_BAR_HEIGHT,
    borderBottomWidth: 1,
  },
  topbarMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X3,
  },
  searchInput: {
    width: 320,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: X6,
    paddingTop: X4,
    paddingBottom: X3,
  },
  contextActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: X4,
    paddingBottom: X2,
    borderBottomWidth: 1,
    marginHorizontal: X2,
  },
  colAsset: {
    flex: 1,
  },
  colChange: {
    width: 140,
    textAlign: 'right',
    paddingRight: X4,
  },
  colRange: {
    width: 180 + X4,
    paddingLeft: X3,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: X1,
  },
  row: {
    // EtAssetItem's default layout already renders Logo / Content / Change /
    // Trailing in the order this screen needs — see et-asset-item.tsx.
    // No additional row-level styling required beyond the component default.
  },
  rangeCell: {
    width: 180,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: X2,
    paddingHorizontal: X6,
  },
  stateBody: {
    textAlign: 'center',
  },
});

export default DiscoverStocksDesktop;
