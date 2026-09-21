/**
 * Storybook Template Components
 *
 * Reusable components for creating consistent, eToro-branded documentation pages.
 * Features a premium dark theme with green glow effects and shadcn-style clarity.
 *
 * Usage:
 * ```tsx
 * import { Page, Section, Title, Desc, Preview, CodeBlock, PropsTable } from '../utils/storybook-template';
 *
 * export const MyStory: Story = {
 *   render: () => (
 *     <Page>
 *       <Section>
 *         <Title>Component Name</Title>
 *         <Desc>Description of the component.</Desc>
 *         <Preview>
 *           <MyComponent />
 *         </Preview>
 *         <CodeBlock code={`<MyComponent />`} />
 *       </Section>
 *     </Page>
 *   ),
 * };
 * ```
 */

import { EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core/hooks';
import { X3 } from 'etoro-ui/core/styles/spacing';
import * as Clipboard from 'expo-clipboard';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { ThemePreference, useAppTheme } from '../../../apps/etoro-mobile/src/context/theme-context';

// ─────────────────────────────────────────────────────────────
// Theme System (uses eToro theme tokens)
// ─────────────────────────────────────────────────────────────

type ThemeMode = 'light' | 'dark' | 'system';

interface StoryThemeContextValue {
  themePreference: ThemePreference;
  setThemePreference: (themePreference: ThemePreference) => void;
}

const StoryThemeContext = createContext<StoryThemeContextValue | null>(null);

export const useStoryTheme = () => {
  const context = useContext(StoryThemeContext);
  const systemScheme = useColorScheme();

  return {
    themePreference: context?.themePreference ?? 'system',
    setThemePreference: context?.setThemePreference ?? (() => {}),
    isDark: context?.themePreference === 'system' ? systemScheme === 'dark' : context?.themePreference === 'dark',
  };
};

/**
 * Provider for theme mode switching in stories
 */
export const StoryThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { themePreference, setThemePreference } = useAppTheme();

  return <StoryThemeContext.Provider value={{ themePreference, setThemePreference }}>{children}</StoryThemeContext.Provider>;
};

/**
 * Theme hook providing eToro color tokens mapped to storybook needs
 * Switches between light/dark color sets based on selected mode
 */
export const useTheme = () => {
  const { themePreference, setThemePreference, isDark } = useStoryTheme();
  const { colors } = useEtoroTheme();

  const c = useMemo(
    () => ({
      // Backgrounds - layered depth
      bg: colors.bgNeutralPrimary,
      bgMuted: colors.bgNeutralSecondary,
      bgElevated: colors.bgNeutralTertiary,
      bgCode: colors.bgNeutralQuaternary,

      // Glow effects (green transparency for premium look)
      glowSubtle: colors.positiveGradientSecondary30,
      glowMedium: colors.positiveGradientSecondary45,

      // Text hierarchy
      text: colors.textPrimaryNeutral,
      textMuted: colors.textSecondaryNeutral,
      textTertiary: colors.textTertiaryNeutral,
      textCode: colors.textSecondaryNeutral,

      // Borders - subtle separation
      border: colors.dividerTertiary,
      borderSubtle: colors.dividerQuinary,

      // Accents (eToro green)
      accent: colors.statusPositive,
      accentBg: colors.bgPositiveTertiary,
      accentText: colors.actionBrandText,
    }),
    [colors],
  );

  return { themePreference, setThemePreference, c, isDark };
};

// ─────────────────────────────────────────────────────────────
// Theme Switcher (Compact pill design)
// ─────────────────────────────────────────────────────────────

export const ThemeSwitcher = () => {
  const { themePreference, setThemePreference, c } = useTheme();

  const options: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <View style={[styles.themeSwitcher, { backgroundColor: c.bgMuted }]}>
      {options.map((opt) => {
        const isActive = themePreference === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setThemePreference(opt.value)}
            hitSlop={4}
            style={({ pressed }) => [
              styles.themeOption,
              isActive && styles.themeOptionActive,
              {
                backgroundColor: isActive ? c.bgElevated : pressed ? c.bgElevated : 'transparent',
              },
            ]}
          >
            <EtText style={[styles.themeOptionText, { color: isActive ? c.text : c.textTertiary }]}>{opt.label}</EtText>
          </Pressable>
        );
      })}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Page Components
// ─────────────────────────────────────────────────────────────

export const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoryThemeProvider>
      <PageInner>{children}</PageInner>
    </StoryThemeProvider>
  );
};

const PageInner = ({ children }: { children: React.ReactNode }) => {
  const { c } = useTheme();
  return (
    <ScrollView style={[styles.page, { backgroundColor: c.bg }]} contentContainerStyle={styles.pageContent}>
      <View style={styles.header}>
        <ThemeSwitcher />
      </View>
      {children}
    </ScrollView>
  );
};

export const Section = ({ children, noPadding = false }: { children: React.ReactNode; noPadding?: boolean }) => (
  <View style={[styles.section, noPadding && styles.sectionNoPadding]}>{children}</View>
);

export const Title = ({ children, accent = false }: { children: string; accent?: boolean }) => {
  const { c } = useTheme();
  return (
    <View style={styles.titleContainer}>
      <EtText variant="heading-compact" style={{ color: c.text }}>
        {children}
      </EtText>
      {accent && <View style={[styles.titleAccent, { backgroundColor: c.accent }]} />}
    </View>
  );
};

export const SubTitle = ({ children }: { children: string }) => {
  const { c } = useTheme();
  return (
    <View style={styles.subTitleRow}>
      <View style={[styles.subTitleDot, { backgroundColor: c.accent }]} />
      <EtText variant="label-primary-semibold" style={{ color: c.text }}>
        {children}
      </EtText>
    </View>
  );
};

export const Desc = ({ children }: { children: string }) => {
  const { c } = useTheme();
  return (
    <EtText variant="body-secondary-regular" style={[styles.desc, { color: c.textMuted }]}>
      {children}
    </EtText>
  );
};

export const Label = ({ children }: { children: string | string[] }) => {
  const { c } = useTheme();
  return (
    <EtText variant="caption-regular" style={[styles.label, { color: c.textTertiary }]}>
      {children}
    </EtText>
  );
};

// ─────────────────────────────────────────────────────────────
// Preview Component (with green glow effect)
// ─────────────────────────────────────────────────────────────

export const Preview = ({ children, glow = true }: { children: React.ReactNode; glow?: boolean }) => {
  const { c, isDark } = useTheme();

  return (
    <View style={styles.previewOuter}>
      {glow && isDark && <View style={[styles.previewGlow, { backgroundColor: c.glowSubtle }]} />}
      <View style={[styles.preview, { backgroundColor: c.bg, borderColor: c.borderSubtle }]}>{children}</View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// CodeBlock Component (Card style with header)
// ─────────────────────────────────────────────────────────────

export const CodeBlock = ({ code, title = 'tsx' }: { code: string; title?: string }) => {
  const { c } = useTheme();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={[styles.codeCard, { borderColor: c.borderSubtle }]}>
      <View style={[styles.codeHeader, { backgroundColor: c.bgMuted }]}>
        <View style={[styles.codeLangBadge, { backgroundColor: c.bgElevated }]}>
          <EtText style={[styles.codeLangText, { color: c.textTertiary }]}>{title}</EtText>
        </View>
        <Pressable onPress={handleCopy} style={[styles.copyBtn, copied && { backgroundColor: c.accentBg }]}>
          <EtText style={[styles.copyText, { color: copied ? c.accent : c.textTertiary }]}>{copied ? 'Copied!' : 'Copy'}</EtText>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.codeContent, { backgroundColor: c.bgElevated }]}
        contentContainerStyle={styles.codeContentInner}
      >
        <EtText style={[styles.codeText, { color: c.textCode }]} selectable>
          {code}
        </EtText>
      </ScrollView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Props Table (Refined design)
// ─────────────────────────────────────────────────────────────

export interface PropDef {
  prop: string;
  type: string;
  default: string;
  description?: string;
}

export const PropsTable = ({ data }: { data: PropDef[] }) => {
  const { c } = useTheme();
  return (
    <View style={[styles.table, { borderColor: c.borderSubtle }]}>
      <View style={[styles.tableHeader, { backgroundColor: c.bgMuted, borderBottomColor: c.borderSubtle }]}>
        <EtText variant="caption-medium" style={[styles.cellProp, { color: c.textMuted }]}>
          Prop
        </EtText>
        <EtText variant="caption-medium" style={[styles.cellType, { color: c.textMuted }]}>
          Type
        </EtText>
        <EtText variant="caption-medium" style={[styles.cellDefault, { color: c.textMuted }]}>
          Default
        </EtText>
      </View>
      {data.map((row, index) => (
        <View
          key={row.prop}
          style={[
            styles.tableRow,
            index < data.length - 1 && {
              borderBottomWidth: 1,
              borderBottomColor: c.borderSubtle,
            },
          ]}
        >
          <View style={styles.cellProp}>
            <View style={[styles.propBadge, { backgroundColor: c.accentBg }]}>
              <EtText style={[styles.propText, { color: c.text }]}>{row.prop}</EtText>
            </View>
          </View>
          <EtText style={[styles.cellType, styles.typeText, { color: c.textMuted }]}>{row.type}</EtText>
          <EtText style={[styles.cellDefault, styles.defaultText, { color: c.textTertiary }]}>{row.default}</EtText>
        </View>
      ))}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Layout Helpers
// ─────────────────────────────────────────────────────────────

export const Row = ({ children, gap = 24, wrap = false }: { children: React.ReactNode; gap?: number; wrap?: boolean }) => (
  <View style={[styles.row, { gap }, wrap && styles.rowWrap]}>{children}</View>
);

export const Col = ({ children, gap = 8 }: { children: React.ReactNode; gap?: number }) => <View style={[styles.col, { gap }]}>{children}</View>;

export const Divider = () => {
  const { c } = useTheme();
  return <View style={[styles.divider, { backgroundColor: c.borderSubtle }]} />;
};

export const Spacer = ({ size = 24 }: { size?: number }) => <View style={{ height: size }} />;

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: { flex: 1 },
  pageContent: { paddingBottom: 64 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  section: { paddingHorizontal: 24, paddingTop: 32, gap: 16 },
  sectionNoPadding: { paddingHorizontal: 0 },

  themeSwitcher: { flexDirection: 'row', borderRadius: 8, padding: 3 },
  themeOption: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  themeOptionActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  themeOptionText: { fontSize: 12, fontWeight: '500' },

  titleContainer: { gap: 8 },
  titleAccent: { height: 3, width: 40, borderRadius: 2 },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  subTitleDot: { width: 6, height: 6, borderRadius: 3 },
  desc: { lineHeight: 22 },
  label: { marginTop: 8 },

  previewOuter: { position: 'relative' },
  previewGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 20,
    opacity: 0.5,
  },
  preview: {
    padding: X3,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },

  codeCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  codeLangBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  codeLangText: { fontSize: 11, fontWeight: '500', fontFamily: 'Menlo' },
  codeContent: {},
  codeContentInner: { padding: 16, paddingTop: 12 },
  codeText: { fontFamily: 'Menlo', fontSize: 12, lineHeight: 20 },
  copyBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  copyText: { fontSize: 12, fontWeight: '500' },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  rowWrap: { flexWrap: 'wrap' },
  col: { alignItems: 'center' },
  divider: { height: 1, marginVertical: 16 },

  table: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cellProp: { flex: 1.2 },
  cellType: { flex: 2 },
  cellDefault: { flex: 1, textAlign: 'right' },
  propBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  propText: { fontFamily: 'Menlo', fontSize: 11, fontWeight: '500' },
  typeText: { fontFamily: 'Menlo', fontSize: 11 },
  defaultText: { fontFamily: 'Menlo', fontSize: 11 },
});
