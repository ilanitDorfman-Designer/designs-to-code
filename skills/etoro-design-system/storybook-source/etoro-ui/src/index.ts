// ==============================================
// eToro Core Component Library
// ==============================================
// This file provides a clean API surface for all core UI components.
// Components are organized by category for better discoverability.
// Updated: 2026-01-13

// ========== Foundations ==========
export {
  DS_REACT_ICON_ALL_KEYS,
  DS_REACT_ICON_GALLERY,
  DS_REACT_ICON_REGISTRY,
  DS_REACT_ICON_SIZE_PX,
  dsReactIconSizeToIconSize,
  DsReactPlaceholderIcon,
  EtIconV2,
  getDsReactRegistryIcon,
  hasDsReactRegistrySvg,
  isDsReactIconName,
  resolveDsReactRegistryName,
} from './components/et-icon-v2';
export {
  EtIllustration,
  getIllustrationFileName,
  getIllustrationUrl,
  hasIllustrationVariant,
  ILLUSTRATION_META,
  ILLUSTRATION_NAMES,
  ILLUSTRATION_SIZE_PX,
  ILLUSTRATIONS_CDN_BASE_URL,
  isIllustrationName,
  resolveIllustrationSize,
} from './components/et-illustration';
export type { EtoroMarkProps } from './core/icons/etoro-mark';
export { EtoroMark } from './core/icons/etoro-mark';
export type { EtoroWordmarkProps } from './core/icons/etoro-wordmark';
export { EtoroWordmark } from './core/icons/etoro-wordmark';
export { EtAnimatedCount } from './foundations/animated-digits/et-animated-count';
export { EtoroIcon } from './foundations/icon-assets/et-icon';
export { EtBlurredText, type EtBlurredTextProps, type TextVariant } from './foundations/text/et-blurred-text';
export { EtText } from './foundations/text/et-text';

// ========== Layout Components ==========
export { EtCard } from './components/card';
export { EtAccordion } from './components/layout/accordion/et-accordion';
export { EtDivider } from './components/layout/divider';
export { EtExpandable } from './components/layout/expandable/et-expandable';
export { EtFooter } from './components/layout/footer';
export { EtUserProfileHeader } from './components/layout/headers/user-profile';
export { EtKeyboardAvoidingView } from './components/layout/keyboard-avoiding-view';
export { EtLazyMount } from './components/layout/lazy-mount';
export { EtMotionSwap } from './components/layout/motion-swap';
export { EtSection } from './components/layout/section';
export {
  EtSplitLayout,
  SPLIT_LAYOUT_COLUMN_LOGO_SLOT_HEIGHT,
  SPLIT_LAYOUT_COLUMN_WORDMARK_HEIGHT,
  SPLIT_LAYOUT_CONTENT_COLUMN_WIDTH,
  SPLIT_LAYOUT_MOBILE_TOP_BAR_FALLBACK_HEIGHT,
  SPLIT_LAYOUT_TOP_BAR_CONTROL_HEIGHT,
  SPLIT_LAYOUT_TOP_BAR_WORDMARK_HEIGHT,
  splitLayoutShellStyles,
  useSplitLayoutContext,
} from './components/layout/split-layout';
export { EtPreviewContainer, PREVIEW_CONTAINER_BOTTOM_OFFSET, PREVIEW_HEIGHT } from './components/preview-container';
export type { CollapsibleHeaderModel, UseCollapsibleHeaderModelOptions } from './components/screen';
export {
  DEFAULT_FILTER_ROW_MAX_HEIGHT,
  DEFAULT_KEYBOARD_BOTTOM_OFFSET,
  DEFAULT_TOP_NAV_HEIGHT,
  EtProgressivePageBlur,
  EtScreen,
  EtScreenOverlay,
  EtScreenV2,
  EtScrollBlurBackdrop,
  EtTabBarVisibilityProvider,
  useCollapsibleHeaderModel,
  useHideTabBarOnScroll,
  useScrollHandlers,
  useTabBarVisibility,
} from './components/screen';
export { useOptionalScreenContext, useScreenContext } from './components/screen/api/context';
export type { EtSettingsToggleCardAction, EtSettingsToggleCardProps } from './components/settings-toggle-card';
export { EtSettingsToggleCard } from './components/settings-toggle-card';
export { EtTopbar } from './components/topbar';
export { EtScrollView } from './components/view/et-scroll-view';
export { EtView } from './components/view/et-view';
export { EtWizard } from './shared/layout/wizard';

// ========== Button Components ==========
export { EtButton } from './components/button/et-button';
export { EtIconButton } from './components/button/et-icon-button';
export { EtBuySellButton } from './components/buy-sell-button';
export { EtFabMenu } from './components/fab-menu';
export { EtGlassFab } from './components/glass-fab';
export { EtLink } from './components/link/et-link';

// ========== Control Components ==========
export { EtButtonGroup } from './components/controls/button-group';
export { EtCheckbox } from './components/controls/checkbox/et-checkbox';
export { EtChip } from './components/controls/chips/et-chip';
export { EtChipsGroupV2 } from './components/controls/chips-group-v2/et-chips-group-v2';
export { EtNumberPicker } from './components/controls/number-picker/et-number-picker';
export { EtRadioGroup } from './components/controls/radio-group/et-radio-group';
export { EtSelect } from './components/controls/select/et-select';
export { EtSelectionTileGroup } from './components/controls/selection-tile-group/et-selection-tile-group';
export { EtTabs } from './components/controls/tabs/et-tabs';
export { EtTextToggle } from './components/controls/text-toggle/et-text-toggle';
export { TimeFrameSelector } from './components/controls/time-frame/et-timeframe';
export { EtTimeFrameToggle } from './components/controls/time-frame-toggle/et-time-frame-toggle';
export { EtToggle } from './components/controls/toggle/et-toggle';
export { EtToggleGroup } from './components/controls/toggle-group';
export { EtToggleSwitch } from './components/controls/toggle-switch/et-toggle-switch';

// ========== Status Components ==========
export { EtBadge } from './components/status/badge';
export { EtClubBadge, type EtClubBadgeColorScheme, type EtClubBadgeProps, type EtClubBadgeVariant } from './components/status/club-badge';
export { type ClubTier, EtClubTierMedal, type EtClubTierMedalProps } from './components/status/club-tier-badge';
export { EtRange } from './components/status/et-range/et-range';
export { EtRangeSlider } from './components/status/et-range-slider';
export { EtPopularInvestorBadge, EtProInvestorBadge, type InvestorBadgeProps, type InvestorBadgeVariant } from './components/status/investor-badge';
export { EtLoader } from './components/status/loader';
export { EtProgressBar } from './components/status/progress-bar';
export { EtProgressBarFillType } from './components/status/progress-bar/api';
export { EtProgressV2 } from './components/status/progress-v2';
export { EtRiskScore, parseRiskScoreValue } from './components/status/risk-score';
export type { EtSkeletonProps } from './components/status/skeleton/api/types';
export { EtSkeletonCard } from './components/status/skeleton/components/et-skeleton-card';
export { EtSkeletonChips } from './components/status/skeleton/components/et-skeleton-chips';
export { EtSkeletonGroup } from './components/status/skeleton/components/et-skeleton-group';
export { EtSkeletonList } from './components/status/skeleton/components/et-skeleton-list';
export { EtSkeletonProfile } from './components/status/skeleton/components/et-skeleton-profile';
export { EtSkeleton } from './components/status/skeleton/et-skeleton';
export { useShimmerClock } from './components/status/skeleton/hooks/use-shimmer-clock';
export { EtStepIndicator } from './components/status/step-indicator';

// ========== List Components ==========
export type { AssetItemRateChipProps, ChangeSentiment } from './components/list/asset-item';
export { EtAssetItem } from './components/list/asset-item/et-asset-item';
export type { RateChipColors } from './components/list/asset-item/utils/get-rate-chip-colors';
export { getRateChipColors } from './components/list/asset-item/utils/get-rate-chip-colors';
export type { EtFlatListProps, EtSectionListProps } from './components/list/flat-list';
export { EtFlatList, EtSectionList } from './components/list/flat-list';
export type {
  EtListProps,
  ListColumnAlign,
  ListColumnProps,
  ListEmptyProps,
  ListErrorProps,
  ListFooterProps,
  ListHeaderProps,
  ListRenderItemInfo,
  ListSkeletonProps,
  ListSortCycle,
  ListSortDirection,
} from './components/list/list';
export { defaultSortCycle, EtList } from './components/list/list';
export { EtListItem } from './components/list/list-item/et-list-item';
export { EtListItem as EtListItemV2 } from './components/list/list-item-v2/et-list-item';
export type { EtSwipeableActionProps, EtSwipeableRowProps, SwipeableRowContextValue } from './components/list/swipeable-row';
export { EtSwipeableRow, useSwipeableRowContext } from './components/list/swipeable-row';

// ========== Input Components ==========
export { EtDatepicker } from './components/datepicker';
export { EtInput } from './components/input/input-v2/et-input';
export { getInputFormSubmitProps } from './components/input/input-v2/utils/input-form-submit-props';
export { EtKeyboard } from './components/input/keyboard';
export { EtNumericKeypad } from './components/input/numeric-keypad';
export { EtOtpInput } from './components/input/otp-input/et-otp-input';
export { EtPhoneInput } from './components/input/phone-input';
export { EtSearchInput } from './components/input/search-input';
export { EtTimepicker } from './components/timepicker/et-timepicker';
export { formatDate } from './utils/date-formatters';

// ========== Navigation Components ==========
export { EtPagination } from './components/navigation/pagination/et-pagination';
export { usePagination } from './components/navigation/pagination/hooks';

// ========== Overlay Components ==========
// Store/hook APIs (registerOverlaySurface, OverlayPriority, useSheetPresentationCounter, …)
// live in `@etoro/common/infra/app-float-overlay` and are intentionally NOT re-exported here —
// keeping them out of the UI-kit barrel avoids a UI-layer dependency detour for lower-layer
// consumers (e.g. `common/infra/datadome`) and prevents accidental "import from etoro-ui"
// coupling for what is a piece of infra state.
export { AppFloatOverlayHost } from './components/overlays/app-float-overlay';
export { EtBottomSheet as EtBottomSheetV2 } from './components/overlays/bottom-sheet-v2/et-bottom-sheet';
export { EtModal } from './components/overlays/modal';
export { EtPopover } from './components/overlays/popover';
export { EtTooltip } from './components/overlays/tooltip';

// ========== Feedback Components ==========
export { type AlertBannerSeverity, EtAlertBanner, type EtAlertBannerProps } from './components/feedback/alert-banner';
export type {
  BannerActionsProps,
  BannerDescriptionProps,
  BannerIllustrationProps,
  BannerIllustrationSize,
  BannerTitleProps,
  EtBannerChild,
  EtBannerChildren,
  EtBannerProps,
} from './components/feedback/banner';
export { EtBanner } from './components/feedback/banner';
export type { LoaderOverlayContextValue, LoaderOverlayProviderProps } from './components/feedback/loader-overlay';
export { LoaderOverlayProvider, useLoader } from './components/feedback/loader-overlay';
export { NetworkStatusIndicator } from './components/feedback/network-status-indicator';
export { EtToast, TOAST_DIMENSIONS, ToastProvider, useToast } from './components/feedback/toast';

// ========== Table Components ==========
export type { EtTableFixedColumnHeaderProps, EtTableHorizontalEndFadeProps, EtTableSortableHeaderCellProps } from './components/tables/table';
export {
  EtTable,
  EtTableBody,
  EtTableFixedColumnHeader,
  EtTableHead,
  EtTableHorizontalEndFade,
  EtTableRow,
  EtTableSortableHeaderCell,
} from './components/tables/table';

// ========== Social Components ==========
export { EtAvatar } from './components/social/avatar';
export { EtPost, SHARED_POST_BORDER_WIDTH } from './components/social/post';
export { PostContext, usePostContext } from './components/social/post';
export { useFooterActionStyle, useHapticHandler } from './components/social/post';
export { EtPoll, PollProvider } from './components/social/post/subcomponents/poll';

// ========== Text Display Components ==========
export { EtReadMoreText } from './components/et-read-more-text';

// ========== Data Display Components ==========
export { EtAssetCard, type EtAssetCardAsset, type EtAssetCardProps } from './components/asset-card';
export { EtCountryFlag } from './components/country-flag';
export { EtCryptoCard } from './components/crypto-card';
export {
  type AmountInputDisplayAffixProps,
  EtAmountInputDisplay,
  type EtAmountInputDisplayProps,
} from './components/data-display/amount-input-display';
/** @deprecated Use EtAssetCard from components/asset-card (EtMediaCard-based). */
export { EtAssetCard as EtLegacyAssetCard } from './components/data-display/asset-card/et-asset-card';
export { type EtAssetData, EtAssetInfo, type EtAssetInfoProps } from './components/data-display/asset-info';
export { EtBreakdownChart } from './components/data-display/breakdown-chart/et-breakdown-chart';
export { EtFadeMask, type EtFadeMaskProps } from './components/data-display/fade-mask';
export type { CursorData } from './components/data-display/line-chart/api/types';
export { Cursor } from './components/data-display/line-chart/components/cursor';
export { GraphGradient } from './components/data-display/line-chart/components/graph-gradient';
export { EtLineChart } from './components/data-display/line-chart/et-line-chart';
export type { MultiLineChartProps, MultiLineChartSeries } from './components/data-display/multi-line-chart/api/types';
export { EtMultiLineChart } from './components/data-display/multi-line-chart/et-multi-line-chart';
export { EtNumber, type EtNumberFormatOptions, type EtNumberFormatType, type EtNumberProps } from './components/data-display/number';
export { EtPieChart } from './components/data-display/pie-chart/et-pie-chart';
export { EtPrice, type EtPriceContextValue, type EtPriceProps } from './components/data-display/price';
export { EtScrollHeaderFade, type EtScrollHeaderFadeProps } from './components/data-display/scroll-header-fade';
export { EtSparkChart } from './components/data-display/spark-chart/et-spark-chart';
export { EtStory } from './components/data-display/story';
export {
  EtSymbol,
  type EtSymbolProps,
  type SymbolCurrencyProps,
  type SymbolDateProps,
  type SymbolIconProps,
  type SymbolShape,
  type SymbolSize,
  type SymbolTextProps,
} from './components/data-display/symbol';
export { EtTicker } from './components/data-display/ticker/et-ticker';
export { EtTicker as EtTickerV2, getEtTickerHeight } from './components/data-display/ticker-v2';
export { EtTileChart } from './components/data-display/tile-chart/tile-chart';
export { type EtUserData, EtUserInfo, type EtUserInfoProps } from './components/data-display/user-info';
export { EtInstrumentIsland, type EtInstrumentIslandProps, type IslandInstrument } from './components/instrument-island';
export type {
  EtMediaCardProps,
  EtMediaCardSize,
  EtMediaCardVariant,
  MediaCardBackgroundTone,
  MediaCardFooterOverlay,
  MediaCardFooterOverlayOpacity,
  MediaCardFooterProps,
  MediaCardHeaderProps,
  MediaCardLogoPlacement,
  MediaCardLogoProps,
  MediaCardSlotProps,
  MediaCardTextSlotProps,
  MediaCardVariantColors,
} from './components/media-card';
export {
  classifyBackgroundTone,
  EtMediaCard,
  resolveMediaCardFooterOverlay,
  resolveMediaCardFooterOverlayPreset,
  resolveMediaCardVariantColors,
  useMediaCardContext,
} from './components/media-card';
export { EtPositionCard } from './components/position-card/et-position-card';
export { EtSmartPortfolioCard, type EtSmartPortfolioCardProps } from './components/smart-portfolio-card';
export { EtTopTraderCard, type EtTopTraderCardProps } from './components/top-trader-card';
export { EtTrendingAssetsCard, type EtTrendingAssetsCardAsset, type EtTrendingAssetsCardProps } from './components/trending-assets-card';
export { EtTrendingStockCard, type EtTrendingStockCardProps } from './components/trending-stock-card';

// ========== Type Exports ==========
export type { ButtonSize, ButtonVariant, EtButtonProps } from './components/button/utils/types';
export type { BuySellButtonSize, BuySellButtonType, EtBuySellButtonProps } from './components/buy-sell-button';
export type {
  CardContentProps as EtCardContentProps,
  CardFooterProps as EtCardFooterProps,
  CardHeaderProps as EtCardHeaderProps,
  EtCardProps,
} from './components/card';
export type { ButtonGroupItemProps, EtButtonGroupProps } from './components/controls/button-group';
export type { ChipsGroupItem, ChipsGroupLayout, ChipsGroupSelectionMode, EtChipsGroupV2Props } from './components/controls/chips-group-v2/api';
export type { EtSelectProps } from './components/controls/select/api';
export type { EtStepperProps } from './components/controls/stepper';
export { EtStepper } from './components/controls/stepper';
export type { EtTabsProps, TabsContentProps, TabsListProps, TabsListVariant, TabsTriggerProps } from './components/controls/tabs/api';
export type { EtTimeFrameToggleProps, TimeFrameOption } from './components/controls/time-frame-toggle/api';
export type { EtToggleGroupProps, ToggleGroupOptionProps, ToggleGroupOptionRenderState, ToggleGroupSize } from './components/controls/toggle-group';
export type { EtToggleSwitchProps, ToggleSwitchSize } from './components/controls/toggle-switch/api';
export type { EtCountryFlagProps } from './components/country-flag';
export type {
  CryptoLogoProps,
  CryptoNameProps,
  CryptoPriceProps,
  CryptoSymbolProps,
  CryptoUnitsProps,
  EtCryptoCardProps,
} from './components/crypto-card';
export type { BreakdownChartData, EtBreakdownChartProps } from './components/data-display/breakdown-chart/api';
export type {
  EtPieChartProps,
  PieChartColor,
  PieChartData,
  PieChartSize,
  SegmentLegendItemProps,
  SegmentLegendLayout,
  SegmentLegendProps,
} from './components/data-display/pie-chart/api';
export type { EtSparkChartProps } from './components/data-display/spark-chart/api';
export type {
  EtTickerProps as EtTickerV2Props,
  TickerContentProps,
  TickerGradientProps,
  TickerItem,
  TickerItemProps,
} from './components/data-display/ticker-v2/api';
export type { TileChartData } from './components/data-display/tile-chart/tile-chart.interface';
export type { DatepickerProps, DatepickerValueType, DatepickerVariant } from './components/datepicker/api/types';
export type {
  DsReactFillOnlyName,
  DsReactGalleryIconName,
  DsReactIconName,
  DsReactIconSection,
  DsReactIconSize,
  DsReactLocalIconProps,
  IconName as EtIconV2Name,
  EtIconProps as EtIconV2Props,
  IconSize as EtIconV2Size,
  IconVariant as EtIconV2Variant,
} from './components/et-icon-v2';
export type { EtIllustrationProps, IllustrationFormat, IllustrationName, IllustrationSize, IllustrationTheme } from './components/et-illustration';
export type { EtReadMoreTextProps } from './components/et-read-more-text/api';
export type { EtFabMenuActionsProps, EtFabMenuButtonProps, EtFabMenuProps, EtFabMenuTriggerProps } from './components/fab-menu';
export type { ShowToastConfig, ToastConfig, ToastProviderProps, ToastStatus, ToastType } from './components/feedback/toast';
export type { EtGlassFabProps } from './components/glass-fab';
export type { InputType } from './components/input/input-v2/api/types';
export type { EtKeyboardKeysProps, EtKeyboardProps, EtKeyboardSlotProps, KeyboardKeyValue } from './components/input/keyboard';
export type { EtNumericKeypadProps, EtNumericKeypadRejectionReason } from './components/input/numeric-keypad';
export type { EtOtpInputProps, OtpErrorMessageProps, OtpInputLength, OtpInputSize, OtpToggleProps } from './components/input/otp-input/api/types';
export type { EtPhoneInputHandle, EtPhoneInputProps } from './components/input/phone-input';
export type { EtAccordionProps } from './components/layout/accordion/api';
export type { EtDividerProps } from './components/layout/divider';
export type { EtExpandableProps } from './components/layout/expandable/api';
export type {
  EtFooterLinkProps,
  EtFooterProps,
  EtFooterScrollableProps,
  EtFooterScrollDirection,
  EtFooterSectionProps,
} from './components/layout/footer/api';
export type { EtKeyboardAvoidingViewProps } from './components/layout/keyboard-avoiding-view';
export type { EtLazyMountProps } from './components/layout/lazy-mount';
export type { EtMotionSwapProps } from './components/layout/motion-swap';
export type {
  EtSectionChildren,
  EtSectionProps,
  SectionChipsProps,
  SectionContentProps,
  SectionPaginationProps,
  SectionSelectTitleProps,
  SectionTitleProps,
} from './components/layout/section/api';
export type {
  EtSplitLayoutProps,
  SplitLayoutAsidePosition,
  SplitLayoutAsideProps,
  SplitLayoutContextValue,
  SplitLayoutMainProps,
  SplitLayoutTopBarProps,
} from './components/layout/split-layout';
export type { EtLinkIconProps, EtLinkLabelProps, EtLinkProps, LinkIconPosition, LinkSize, LinkVariant } from './components/link/api/types';
export type {
  EtListItemChildren,
  EtListItemProps,
  ListItemLayoutMode,
  ListItemSize,
  ListItemSkeleton,
  ListItemSlotProps,
} from './components/list/list-item-v2/api';
export { clampPage } from './components/navigation/pagination';
export type { EtPaginationProps, PaginationColor, PaginationSize } from './components/navigation/pagination/api';
export type { UsePaginationOptions, UsePaginationResult } from './components/navigation/pagination/hooks';
export type {
  BottomSheetModal,
  EtBottomSheetAnimationPreset,
  EtBottomSheetContentProps,
  EtBottomSheetFooterProps,
  EtBottomSheetHeaderProps,
  EtBottomSheetListProps,
  EtBottomSheetProps as EtBottomSheetV2Props,
} from './components/overlays/bottom-sheet-v2/api';
export type {
  EtModalChildren,
  EtModalContentProps,
  EtModalFooterProps,
  EtModalHeaderActionProps,
  EtModalHeaderProps,
  EtModalHeaderTitleProps,
  EtModalProps,
  EtModalRef,
  ModalBackdropConfig,
} from './components/overlays/modal';
export type { EtPopoverProps, PopoverArrowAlignment, PopoverArrowProps, PopoverDirection } from './components/overlays/popover';
export type { EtTooltipProps, EtTooltipRef, TooltipBodyProps, TooltipTitleProps } from './components/overlays/tooltip';
export type {
  CardActionProps,
  CardChangeProps,
  CardExpandedContentProps,
  CardFooterProps,
  CardHeaderProps,
  CardLabelProps,
  CardNameProps,
  CardPriceProps,
  CardSecondaryInfoProps,
  CardStatRowProps,
  CardSymbolProps,
  CardValueProps,
  EtPositionCardProps,
  ExpandDirection,
} from './components/position-card';
export type { EtPreviewContainerProps, PreviewContainerContentProps, PreviewContainerTrailingProps } from './components/preview-container';
export type {
  EtProgressivePageBlurProps,
  EtScreenContentAlignment,
  EtScreenContentBodyProps,
  EtScreenContentDisclaimerProps,
  EtScreenContentProps,
  EtScreenContentSubtitleProps,
  EtScreenContentTitleProps,
  EtScreenFooterButtonProps,
  EtScreenFooterProps,
  EtScreenOverlayProps,
  EtScreenProps,
  EtScreenScrollViewProps,
  EtScreenTopBarProps,
  EtScreenV2Props,
  EtScreenViewProps,
  EtScrollBlurBackdropProps,
  EtScrollHandlers,
  EtTabBarVisibilityProviderProps,
  UseHideTabBarOnScrollOptions,
  UseScrollHandlersOptions,
} from './components/screen';
export type {
  AvatarMarketOpenProps,
  AvatarMarketStatus,
  AvatarShape,
  AvatarSize,
  AvatarVariant,
  BadgePosition,
  EtAvatarProps,
} from './components/social/avatar';
export type {
  EtPostProps,
  FooterCommentsProps,
  FooterLikesProps,
  FooterSaveProps,
  FooterSharesProps,
  PostBodyProps,
  PostFooterProps,
  PostHeaderProps,
  SharedPostAttachmentProps,
  SharedPostBodyProps,
  SharedPostFrameProps,
  SharedPostHeaderProps,
  TradeDirection,
} from './components/social/post';
export type { PostImageProps } from './components/social/post';
export type { PostLinkProps } from './components/social/post';
export type { PostPollProps } from './components/social/post';
export type { PostTradeProps } from './components/social/post';
export type { PostVideoProps } from './components/social/post';
export type { PostContextValue } from './components/social/post';
export type { FooterActionStyle } from './components/social/post';
export type { PollAnswer, PollProviderProps } from './components/social/post/subcomponents/poll';
export type { BadgeColor, BadgeIconProps, BadgeLabelProps, BadgeSize, EtBadgeProps } from './components/status/badge';
export type { EtRangeProps } from './components/status/et-range/api';
export type { EtRangeSliderProps } from './components/status/et-range-slider/api';
export type { EtLoaderProps, LoaderSize, LoaderState } from './components/status/loader/api';
export type {
  EtProgressV2Color,
  EtProgressV2CustomColor,
  EtProgressV2Props,
  EtProgressV2Size,
  EtProgressV2Variant,
} from './components/status/progress-v2/api';
export type { EtRiskScoreProps, RiskScoreSize, RiskScoreValue, RiskScoreVariant } from './components/status/risk-score';
export type { EtStepIndicatorProps } from './components/status/step-indicator/api';
export type { EtTableBodyFlashListProps, EtTableColumn, EtTableSortDirection, EtTableSortState } from './components/tables/table/api';
export type {
  CompactFieldDisplayProps,
  InputFieldLabelProps,
  TimeFormat,
  TimepickerClockIconProps,
  TimepickerFieldProps,
  TimepickerProps,
  TimepickerVariant,
  TimeValue,
} from './components/timepicker/api/types';
export type { EtLoadableProps, EtScrollViewProps, EtViewProps } from './components/view/api/types';
export type { IconName } from './foundations/icon-assets/api';

// ========== Shared Components ==========
export type { EtTextCopyButtonProps, TextCopyButtonIconProps, TextCopyButtonTextProps } from './shared/et-text-copy-button';
export { EtTextCopyButton } from './shared/et-text-copy-button';
export type { PhoneInputCountry, PhoneInputProps } from './shared/phone-input';
export { PhoneInput } from './shared/phone-input';

// ========== Utility Functions ==========
export { generateMockChartData } from './components/data-display/asset-card/utils';

// ========== Core Exports ==========
export { ScrollProvider, useGlobalScroll } from './core/contexts/scroll/scroll.context';
export { useAvatarHalo } from './core/hooks/use-avatar-halo';

// ========== Legacy/Backward Compatibility Exports ==========
// These exports maintain backward compatibility for existing imports
export type { EtRangeProps as ChartScrubberProps } from './components/status/et-range/api';
export { EtRange as EtChartScrubber } from './components/status/et-range/et-range';
