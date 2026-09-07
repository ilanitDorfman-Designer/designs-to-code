import { memo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../core/hooks';
import { X4, X6 } from '../../core/styles/spacing';
import { CardProvider } from './api/context';
import { EtCardProps } from './api/types';
import { CardContent, CardFooter, CardHalo, CardHeader } from './subcomponents';

// ============================================================================
// Card Layout Component (Consumes Context)
// ============================================================================

interface CardLayoutProps {
  children: ReactNode;
  isPositive?: boolean;
  contentStyle?: EtCardProps['contentStyle'];
}

function CardLayout({ children, isPositive, contentStyle }: CardLayoutProps) {
  const { colors } = useEtoroTheme();

  // Determine background color based on sentiment
  const getBackgroundColor = () => {
    if (isPositive === undefined) {
      return colors.cardDefault;
    }
    return isPositive ? colors.cardPositive : colors.cardNegative;
  };

  const backgroundColor = getBackgroundColor();

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <CardHalo />
      <View testID="etcard-content-layer" style={[styles.contentLayer, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

// ============================================================================
// Root Component
// ============================================================================

/**
 * EtCard - A basic card component with compound component pattern.
 *
 * Renders children directly for full flexibility. Use semantic subcomponents
 * (Header, Content, Footer) for clarity, or mix with custom elements.
 * Features background, shadow, and sentiment-based styling.
 *
 * @example Basic usage
 * ```tsx
 * <EtCard>
 *   <EtCard.Header>
 *     <EtText variant="label-tertiary-semibold">Title</EtText>
 *   </EtCard.Header>
 *   <EtCard.Content>
 *     <EtText variant="num-lg">$42,150.23</EtText>
 *   </EtCard.Content>
 *   <EtCard.Footer>
 *     <EtText variant="body-tiny-regular">Footer text</EtText>
 *   </EtCard.Footer>
 * </EtCard>
 * ```
 *
 * @example With custom elements between sections
 * ```tsx
 * <EtCard>
 *   <EtCard.Header>...</EtCard.Header>
 *   <View style={styles.divider} />
 *   <EtCard.Content>...</EtCard.Content>
 * </EtCard>
 * ```
 *
 * @example With sentiment
 * ```tsx
 * // Positive sentiment (green background + halo in dark mode)
 * <EtCard isPositive={true}>
 *   <EtCard.Content>...</EtCard.Content>
 * </EtCard>
 *
 * // Negative sentiment (red background + halo in dark mode)
 * <EtCard isPositive={false}>
 *   <EtCard.Content>...</EtCard.Content>
 * </EtCard>
 *
 * // Neutral (default - secondary background, no halo)
 * <EtCard>
 *   <EtCard.Content>...</EtCard.Content>
 * </EtCard>
 * ```
 */
function CardComponent({ children, style, contentStyle, shadow = true, isPositive, testID }: EtCardProps) {
  const shadowStyle = shadow
    ? {
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
      }
    : {};

  return (
    <View style={[styles.container, shadowStyle, style]} testID={testID}>
      <CardProvider isPositive={isPositive}>
        <CardLayout isPositive={isPositive} contentStyle={contentStyle}>
          {children}
        </CardLayout>
      </CardProvider>
    </View>
  );
}

// ============================================================================
// Compound Component Assembly
// ============================================================================

const CardBase = memo(CardComponent);
CardBase.displayName = 'EtCard';

/**
 * EtCard compound component with subcomponents.
 *
 * Subcomponents:
 * - `EtCard.Header` - Container for the header section
 * - `EtCard.Content` - Generic content container
 * - `EtCard.Footer` - Container for the footer section
 */
export const EtCard = Object.assign(CardBase, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: X4,
    // Note: no overflow hidden here so shadow can extend beyond bounds
  },
  card: {
    flex: 1,
    borderRadius: X4,
    overflow: 'hidden', // Clips the halo
  },
  contentLayer: {
    paddingHorizontal: X6,
    paddingVertical: X6,
  },
});
