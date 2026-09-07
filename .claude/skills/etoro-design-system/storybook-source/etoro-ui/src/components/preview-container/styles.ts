import { StyleSheet } from 'react-native';

import { TAB_BAR_HEIGHT } from '../../core/styles/constants';
import { X2, X3, X5 } from '../../core/styles/spacing';

const CARD_RADIUS = 20;
/** Blur radius of the card's drop shadow. Exported so the hide animation can slide the shadow off-screen too. */
export const CARD_SHADOW_RADIUS = 18;
/** Side inset of the card — matches the nav bar's TAB_BAR_OUTER_PADDING so their edges align. */
const CARD_SIDE_INSET = 15;

/**
 * Approximate card height — the card actually sizes to its content + padding; this is used ONLY to
 * slide it fully off-screen when hidden, and for host screens to reserve list bottom padding.
 * Over-estimating is harmless (the extra travel is off-screen anyway).
 */
export const PREVIEW_HEIGHT = 96;

/** Gap between the card's bottom edge and the floating nav bar above which it sits. */
const CARD_NAV_GAP = X3;

/**
 * How far the card's bottom floats above the screen's bottom edge: the nav bar's footprint (the kit's
 * `TAB_BAR_HEIGHT`) plus the gap. Host screens that exclude the bottom safe-area edge add
 * `insets.bottom` on top so the card clears the home indicator.
 */
export const PREVIEW_CONTAINER_BOTTOM_OFFSET = TAB_BAR_HEIGHT + CARD_NAV_GAP;

/** Styles for the floating preview glass card. */
export const styles = StyleSheet.create({
  // The floating value card, pinned above the nav bar (its `bottom` is set at the call site). Sizes to
  // its content + padding. Above the page header (zIndex 1000) so it isn't clipped.
  cardContainer: {
    position: 'absolute',
    left: CARD_SIDE_INSET,
    right: CARD_SIDE_INSET,
    zIndex: 1001,
  },
  glassCardPressable: {
    borderRadius: CARD_RADIUS,
  },
  glassCardShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: CARD_SHADOW_RADIUS,
    // `elevation` only affects Android; iOS reads the `shadow*` props above. High lift so the card reads as
    // clearly floating on Android (needs the elevated view to have a background + solid shadowColor, set in
    // the component, or the shadow won't render at all).
    elevation: 32,
  },
  // Rounded glass shell — no border (the nav bar's glass has none too); the glass material provides the
  // edge. Keep the native glass unclipped so its rim/highlight can render cleanly.
  glassCard: {
    borderRadius: CARD_RADIUS,
  },
  glassCardFallback: {
    overflow: 'hidden',
  },
  // Small centred grabber pinned from the card's top (its colour is set at the call site).
  cardHandleRow: {
    position: 'absolute',
    top: X2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cardHandle: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  previewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: X3,
    paddingHorizontal: X5,
    paddingVertical: X3,
  },
  previewTextStack: {
    flexShrink: 1,
  },
});
