import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { EtText, hasDsReactRegistrySvg, resolveDsReactRegistryName, type DsReactGalleryIconName } from 'etoro-ui';
import { EtIconV2, IconVariant } from 'etoro-ui/components/et-icon-v2';

import { DS_REACT_ICON_GALLERY } from './ds-react-icons-data';

import { Desc, Page, Section, SubTitle, useTheme } from '../../utils/storybook-template';

const FIGMA_DS_REACT_ICONS = 'https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37481-148641&m=dev';

type Story = StoryObj;

const meta: Meta = {
  title: 'eToro-UI/Components/Icon V2/DS — React (Figma)',
  parameters: {
    notes: `DS — React icon sheet (Figma). Same section order and symbol order as DS_REACT_ICON_GALLERY. EtIconV2: registry SVG → placeholder for unregistered DS names. Source: ${FIGMA_DS_REACT_ICONS}`,
  },
};

export default meta;

function IconCell({ figmaName, filled }: { figmaName: DsReactGalleryIconName; filled: boolean }) {
  const { c } = useTheme();
  const variant = filled ? IconVariant.Filled : IconVariant.Regular;
  const registryKey = resolveDsReactRegistryName(figmaName, variant);
  const registered = hasDsReactRegistrySvg(figmaName, variant);

  return (
    <View style={styles.cell} accessibilityLabel={`${registryKey} ${filled ? 'filled' : 'regular'} icon`}>
      <EtIconV2 name={figmaName} variant={filled ? IconVariant.Filled : undefined} accessibilityLabel={`${registryKey}${filled ? ' filled' : ''}`} />
      <EtText variant="body-tiny-regular" style={[styles.cellLabel, { color: c.textMuted }]} numberOfLines={3}>
        {registryKey}
      </EtText>
      <EtText variant="body-tiny-regular" style={[styles.statusLine, { color: registered ? c.textMuted : c.textTertiary }]} numberOfLines={1}>
        {registered ? 'Local SVG' : 'Placeholder'}
      </EtText>
    </View>
  );
}

function VariantBlock({ filled, label }: { filled: boolean; label: string }) {
  const { c } = useTheme();

  return (
    <View style={styles.variantBlock}>
      <EtText variant="label-primary-semibold" style={[styles.variantLabel, { color: c.text }]}>
        {label}
      </EtText>
      {DS_REACT_ICON_GALLERY.map((section) => (
        <View key={`${filled ? 'f' : 'r'}-${section.title}`} style={styles.subsection}>
          <EtText variant="body-secondary-semibold" style={{ color: c.textMuted }}>
            {`${section.title} · ${section.figmaNames.length}`}
          </EtText>
          <View style={styles.grid}>
            {section.figmaNames.map((figmaName) => (
              <IconCell key={`${filled ? 'f' : 'r'}-${section.title}-${figmaName}`} figmaName={figmaName} filled={filled} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const ALL_FIGMA_NAMES = DS_REACT_ICON_GALLERY.flatMap((section) => section.figmaNames);
const REGISTERED_COUNT = ALL_FIGMA_NAMES.filter((name) => hasDsReactRegistrySvg(name, IconVariant.Regular)).length;

export const DsReactGallery: Story = {
  render: function DsReactGalleryStory() {
    const { c } = useTheme();

    return (
      <Page>
        <Section>
          <SubTitle>DS — React icon gallery</SubTitle>
          <Desc>
            {`Same structure as Figma: sections and symbol order follow DS_REACT_ICON_GALLERY. First **Regular**; then **Filled** ({name}-fill in the registry, matching export filenames; resolved via IconVariant.Filled + regular name). EtIconV2: registry SVG → placeholder. Default size md 20px.`}
          </Desc>
          <EtText variant="body-secondary-regular" style={{ color: c.textMuted, marginTop: 8 }}>
            {`Symbols in sheet: ${ALL_FIGMA_NAMES.length} · Local SVG: ${REGISTERED_COUNT} · Placeholder: ${ALL_FIGMA_NAMES.length - REGISTERED_COUNT}`}
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: c.textMuted, marginTop: 4 }}>
            {`Figma: ${FIGMA_DS_REACT_ICONS}`}
          </EtText>
        </Section>

        <Section>
          <VariantBlock filled={false} label="Regular" />
        </Section>

        <Section>
          <VariantBlock filled label="Filled" />
        </Section>
      </Page>
    );
  },
};

const styles = StyleSheet.create({
  variantBlock: {
    gap: 16,
    marginTop: 8,
  },
  variantLabel: {
    marginBottom: 4,
  },
  subsection: {
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    rowGap: 16,
    marginTop: 8,
    alignContent: 'flex-start',
  },
  cell: {
    width: 112,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  cellLabel: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 13,
  },
  statusLine: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 9,
    lineHeight: 11,
  },
});
