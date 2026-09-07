import React, { memo } from 'react';

import { ScreenContextProvider } from './api/context';
import { EtScreenProps } from './api/types';
import {
  EtScreenContent,
  ScreenContent,
  ScreenFlashList,
  ScreenFooter,
  ScreenHeader,
  ScreenScrollView,
  ScreenTopBar,
  ScreenView,
} from './subcomponents';

/**
 * EtScreen - Root screen container with compound component pattern.
 *
 * Provides a unified API for building screens with:
 * - TopBar support with scroll-driven animations
 * - Gradient background
 * - Safe area handling
 * - Halo animations
 * - Enter/exit animations
 *
 * @example Basic screen with scrollable content
 * ```tsx
 * <EtScreen gradient>
 *   <EtScreen.TopBar />
 *   <EtScreen.ScrollView>
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 *
 * @example Inner screen with full TopBar (aligned with EtTopbar API)
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar isInnerScreen>
 *     <EtScreen.TopBar.Start>
 *       <EtScreen.TopBar.Action accessibilityLabel="Go back" onPress={goBack}>
 *         <EtoroIcon name="chevronLeft" size={24} />
 *       </EtScreen.TopBar.Action>
 *     </EtScreen.TopBar.Start>
 *     <EtScreen.TopBar.Middle>
 *       <EtScreen.TopBar.Title>Portfolio</EtScreen.TopBar.Title>
 *     </EtScreen.TopBar.Middle>
 *     <EtScreen.TopBar.End>
 *       <EtScreen.TopBar.Action accessibilityLabel="Search" onPress={openSearch}>
 *         <EtoroIcon name="search" size={24} />
 *       </EtScreen.TopBar.Action>
 *     </EtScreen.TopBar.End>
 *   </EtScreen.TopBar>
 *   <EtScreen.ScrollView>
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 *
 * @example Screen with extended header (stays visible when TopBar collapses)
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar>
 *     <EtScreen.TopBar.Start>
 *       <MenuButton />
 *     </EtScreen.TopBar.Start>
 *   </EtScreen.TopBar>
 *   <EtScreen.Header>
 *     <SearchBar />
 *     <TabChips />
 *   </EtScreen.Header>
 *   <EtScreen.ScrollView>
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 *
 * @example Extended header that collapses with the TopBar
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar />
 *   <EtScreen.Header collapseWithTopBar>
 *     <PromoBanner />
 *   </EtScreen.Header>
 *   <EtScreen.ScrollView>
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 *
 * @example Screen with FlashList (virtualized list with TopBar animation)
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar isInnerScreen animation="collapse" />
 *   <EtScreen.FlashList
 *     data={items}
 *     renderItem={({ item }) => <ItemRow item={item} />}
 *     keyExtractor={(item) => item.id}
 *   />
 * </EtScreen>
 * ```
 */
function EtScreenComponent({ children, gradient = false, entering, exiting, animateHalo = false, style, ...safeAreaProps }: EtScreenProps) {
  const hasTopBarChild = React.Children.toArray(children).some((child) => React.isValidElement(child) && child.type === ScreenTopBar);

  return (
    <ScreenContextProvider animateHalo={animateHalo} hasTopBarChild={hasTopBarChild}>
      <EtScreenContent gradient={gradient} entering={entering} exiting={exiting} style={style} safeAreaProps={safeAreaProps}>
        {children}
      </EtScreenContent>
    </ScreenContextProvider>
  );
}

// ============================================================================
// Compound Component Assembly
// ============================================================================

const EtScreenBase = memo(EtScreenComponent);
EtScreenBase.displayName = 'EtScreen';

/**
 * EtScreen compound component with subcomponents.
 *
 * @example Basic scrollable screen
 * ```tsx
 * <EtScreen gradient>
 *   <EtScreen.TopBar isInnerScreen />
 *   <EtScreen.ScrollView>
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 *
 * @example Wizard-style screen with Content slots and Footer
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar isInnerScreen />
 *   <EtScreen.ScrollView>
 *     <EtScreen.Content>
 *       <EtScreen.Content.Title>Personal Details</EtScreen.Content.Title>
 *       <EtScreen.Content.Subtitle>
 *         Fill in the form below to continue.
 *       </EtScreen.Content.Subtitle>
 *       <EtScreen.Content.Body>
 *         <NameForm />
 *       </EtScreen.Content.Body>
 *     </EtScreen.Content>
 *   </EtScreen.ScrollView>
 *   <EtScreen.Footer sticky>
 *     <EtScreen.Footer.Primary onPress={next}>Next</EtScreen.Footer.Primary>
 *   </EtScreen.Footer>
 * </EtScreen>
 * ```
 */
export const EtScreen = Object.assign(EtScreenBase, {
  TopBar: ScreenTopBar,
  Header: ScreenHeader,
  ScrollView: ScreenScrollView,
  FlashList: ScreenFlashList,
  View: ScreenView,
  Content: ScreenContent,
  Footer: ScreenFooter,
});
