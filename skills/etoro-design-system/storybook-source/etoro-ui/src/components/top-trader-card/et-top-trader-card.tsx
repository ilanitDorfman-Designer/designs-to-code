import { getCurrencySymbolByName } from '@etoro/common/currencies';
import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { X1 } from '../../core/styles/spacing';
import { EtText } from '../../foundations/text';
import { EtNumber } from '../data-display/number';
import { EtPrice } from '../data-display/price';
import type { EtUserData } from '../data-display/user-info';
import { EtUserInfo } from '../data-display/user-info';
import { EtMediaCard, useMediaCardContext } from '../media-card';
import { EtAvatar } from '../social/avatar';
import type { EtTopTraderCardProps } from './api';

/**
 * EtTopTraderCard — smart large-image person card (Figma DS 63763:418671).
 *
 * Composes {@link EtMediaCard} (not {@link EtAssetCard}) with:
 * - `size="large"` + required `backgroundImage`
 * - shared content stack (`eyebrow` + `title` + `description`)
 * - `contentBlur` + `footerOverlay="media"`
 * - footer: {@link EtUserInfo} (+ optional trader badge) + rates ({@link EtNumber} / {@link EtPrice.Change})
 *
 * @example
 * ```tsx
 * <EtTopTraderCard
 *   user={{
 *     avatar: { source: 'https://…/avatar.jpg', size: 'medium', alt: 'Robert Steven' },
 *     title: 'Robert Steven',
 *     subtitle: '@reobertsteven',
 *   }}
 *   badge={<InvestorCrownBadge badgeType="Pi" />}
 *   backgroundImage={{ uri: heroUrl }}
 *   title="Global Markets Investor"
 *   description="Long-term, diversified strategy across tech, ETFs, and digital assets…"
 *   price={204.13}
 *   changePercent={0.0005}
 *   change={0.09}
 * />
 * ```
 */
function EtTopTraderCardBase({
  user,
  badge,
  backgroundImage,
  eyebrow,
  title,
  description,
  price,
  currency,
  changePercent,
  change,
  headerEnd,
  onPress,
  accessibilityLabel,
  style,
  testID,
}: EtTopTraderCardProps) {
  const userTitle = user.title ?? '';
  const changeLabel = `${changePercent >= 0 ? '+' : ''}${(changePercent * 100).toFixed(2)}%`;
  const a11y = accessibilityLabel ?? `${userTitle}, ${title}, ${price}, ${changeLabel}`;
  const showHeader = Boolean(headerEnd);

  return (
    <EtMediaCard
      size="large"
      variant="standard"
      backgroundImage={backgroundImage}
      accessibilityLabel={onPress ? undefined : a11y}
      style={style}
      testID={testID}
    >
      {showHeader ? <EtMediaCard.Header end={headerEnd} testID={testID ? `${testID}-header` : undefined} /> : null}
      <EtMediaCard.Content blur eyebrow={eyebrow} title={title} description={description} testID={testID ? `${testID}-content` : undefined} />
      <EtMediaCard.Footer
        overlay="media"
        onPress={onPress}
        accessibilityLabel={onPress ? a11y : undefined}
        testID={testID ? `${testID}-footer` : undefined}
      >
        <TopTraderFooter user={user} badge={badge} price={price} currency={currency} change={change} changePercent={changePercent} />
      </EtMediaCard.Footer>
    </EtMediaCard>
  );
}

/**
 * Glass footer:
 * - Start: {@link EtUserInfo} (avatar + name / handle), optional {@link EtAvatar.Badge}
 * - End: price ({@link EtNumber}) + rates ({@link EtPrice.Change})
 */
function TopTraderFooter({
  user,
  badge,
  price,
  currency,
  change,
  changePercent,
}: {
  user: EtUserData;
  badge?: ReactNode;
  price: number;
  currency?: string;
  change?: number;
  changePercent: number;
}) {
  const { foregroundColor } = useMediaCardContext();
  // Same as asset page / watchlist: absolute = currentPrice - referencePrice.
  const referencePrice = price / (1 + changePercent);
  const absoluteChange = change ?? price - referencePrice;
  /** EtPrice.Change expects percent units (e.g. `0.05`), not a ratio. */
  const changePercentage = changePercent * 100;
  const title = user.title;
  const subtitle = user.subtitle;

  return (
    <View style={styles.footerRow}>
      <EtUserInfo data={user} shrink>
        {user.avatar?.source ? (
          <EtUserInfo.Avatar>{badge ? <EtAvatar.Badge position="bottomRight">{badge}</EtAvatar.Badge> : null}</EtUserInfo.Avatar>
        ) : null}
        {title ? (
          <EtUserInfo.Title>
            <EtText variant="label-primary-semibold" style={{ color: foregroundColor }} numberOfLines={1}>
              {title}
            </EtText>
          </EtUserInfo.Title>
        ) : null}
        {subtitle ? (
          <EtUserInfo.Subtitle>
            <EtText variant="label-tertiary-regular" style={{ color: foregroundColor }} numberOfLines={1}>
              {subtitle}
            </EtText>
          </EtUserInfo.Subtitle>
        ) : null}
      </EtUserInfo>
      <View style={styles.footerEnd}>
        <EtNumber
          value={price}
          format={currency ? 'currency' : 'number'}
          {...(currency ? { symbol: getCurrencySymbolByName(currency) } : {})}
          color={foregroundColor}
        >
          <EtNumber.Value variant="num-ml-medium" />
        </EtNumber>
        <EtPrice price={price} change={absoluteChange} changePercentage={changePercentage}>
          {/* Glass footer only allows the variant foreground colour — no red/green verdict tokens. */}
          <EtPrice.Change variant="label-tertiary-regular" color={foregroundColor} />
        </EtPrice>
      </View>
    </View>
  );
}

const EtTopTraderCardMemo = memo(EtTopTraderCardBase);
EtTopTraderCardMemo.displayName = 'EtTopTraderCard';

export const EtTopTraderCard = EtTopTraderCardMemo;

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: X1,
  },
  footerEnd: {
    alignItems: 'flex-end',
  },
});
