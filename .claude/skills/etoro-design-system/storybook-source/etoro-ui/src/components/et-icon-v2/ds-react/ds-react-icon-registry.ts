import type { ComponentType } from 'react';

import type { DsReactIconName } from './ds-react-icon-gallery';
import type { DsReactLocalIconProps } from './ds-react-local-icon-props';
import { DsReactIconAcademy } from './icons/academy';
import { DsReactIconAccount } from './icons/account';
import { DsReactIconAddCard } from './icons/add-card';
import { DsReactIconAddToWatchlist } from './icons/add-to-watchlist';
import { DsReactIconAddToWatchlist1 } from './icons/add-to-watchlist-1';
import { DsReactIconAddTrade } from './icons/add-trade';
import { DsReactIconAddTradeFill } from './icons/add-trade-fill';
import { DsReactIconAfterHours } from './icons/after-hours';
import { DsReactIconAfterHoursFill } from './icons/after-hours-fill';
import { DsReactIconAlertCircle } from './icons/alert-circle';
import { DsReactIconAlertCircleFill } from './icons/alert-circle-fill';
import { DsReactIconAlertNotification } from './icons/alert-notification';
import { DsReactIconAlertNotificationFill } from './icons/alert-notification-fill';
import { DsReactIconAngleDown } from './icons/angle-down';
import { DsReactIconAngleDownFill } from './icons/angle-down-fill';
import { DsReactIconAngleDownSmall } from './icons/angle-down-small';
import { DsReactIconAngleDownSmallFill } from './icons/angle-down-small-fill';
import { DsReactIconAngleLeft } from './icons/angle-left';
import { DsReactIconAngleLeftFill } from './icons/angle-left-fill';
import { DsReactIconAngleLeftSmall } from './icons/angle-left-small';
import { DsReactIconAngleLeftSmallFill } from './icons/angle-left-small-fill';
import { DsReactIconAngleRight } from './icons/angle-right';
import { DsReactIconAngleRightFill } from './icons/angle-right-fill';
import { DsReactIconAngleRightSmall } from './icons/angle-right-small';
import { DsReactIconAngleRightSmallFill } from './icons/angle-right-small-fill';
import { DsReactIconAngleUp } from './icons/angle-up';
import { DsReactIconAngleUpFill } from './icons/angle-up-fill';
import { DsReactIconAngleUpSmall } from './icons/angle-up-small';
import { DsReactIconAngleUpSmallFill } from './icons/angle-up-small-fill';
import { DsReactIconAnglesUpDown } from './icons/angles-up-down';
import { DsReactIconAnglesUpDownFill } from './icons/angles-up-down-fill';
import { DsReactIconAppleFill } from './icons/apple-fill';
import { DsReactIconArrowDown } from './icons/arrow-down';
import { DsReactIconArrowDownFill } from './icons/arrow-down-fill';
import { DsReactIconArrowDownLeftSmall } from './icons/arrow-down-left-small';
import { DsReactIconArrowDownLeftSmallFill } from './icons/arrow-down-left-small-fill';
import { DsReactIconArrowDownRightSmall } from './icons/arrow-down-right-small';
import { DsReactIconArrowDownRightSmallFill } from './icons/arrow-down-right-small-fill';
import { DsReactIconArrowLeft } from './icons/arrow-left';
import { DsReactIconArrowLeftFill } from './icons/arrow-left-fill';
import { DsReactIconArrowRedo } from './icons/arrow-redo';
import { DsReactIconArrowRedoFill } from './icons/arrow-redo-fill';
import { DsReactIconArrowRight } from './icons/arrow-right';
import { DsReactIconArrowRightFill } from './icons/arrow-right-fill';
import { DsReactIconArrowRightLeft } from './icons/arrow-right-left';
import { DsReactIconArrowRightLeftFill } from './icons/arrow-right-left-fill';
import { DsReactIconArrowUp } from './icons/arrow-up';
import { DsReactIconArrowUpFill } from './icons/arrow-up-fill';
import { DsReactIconArrowUpLeft } from './icons/arrow-up-left';
import { DsReactIconArrowUpLeftFill } from './icons/arrow-up-left-fill';
import { DsReactIconArrowUpRight } from './icons/arrow-up-right';
import { DsReactIconArrowUpRightFill } from './icons/arrow-up-right-fill';
import { DsReactIconArrowsCollapessed } from './icons/arrows-collapessed';
import { DsReactIconArrowsExpand } from './icons/arrows-expand';
import { DsReactIconArrowsExpandFill } from './icons/arrows-expand-fill';
import { DsReactIconArrowsRepeat } from './icons/arrows-repeat';
import { DsReactIconArrowsRepeatFill } from './icons/arrows-repeat-fill';
import { DsReactIconAtm } from './icons/atm';
import { DsReactIconAttach } from './icons/attach';
import { DsReactIconBankPayment } from './icons/bank-payment';
import { DsReactIconBankPaymentFill } from './icons/bank-payment-fill';
import { DsReactIconBellPlus } from './icons/bell-plus';
import { DsReactIconBellPlusFill } from './icons/bell-plus-fill';
import { DsReactIconBellRing } from './icons/bell-ring';
import { DsReactIconBellRingFill } from './icons/bell-ring-fill';
import { DsReactIconBigDotFill } from './icons/big-dot-fill';
import { DsReactIconBlockAccount } from './icons/block-account';
import { DsReactIconBlockCard } from './icons/block-card';
import { DsReactIconBookmark } from './icons/bookmark';
import { DsReactIconBookmarkFill } from './icons/bookmark-fill';
import { DsReactIconBtcFill } from './icons/btc-fill';
import { DsReactIconBullhorn } from './icons/bullhorn';
import { DsReactIconCalendar } from './icons/calendar';
import { DsReactIconCalendarFill } from './icons/calendar-fill';
import { DsReactIconCamera } from './icons/camera';
import { DsReactIconCameraFill } from './icons/camera-fill';
import { DsReactIconCaretDown } from './icons/caret-down';
import { DsReactIconCaretDownFill } from './icons/caret-down-fill';
import { DsReactIconCaretFillDown } from './icons/caret-fill-down';
import { DsReactIconCaretFillUp } from './icons/caret-fill-up';
import { DsReactIconCaretUp } from './icons/caret-up';
import { DsReactIconCaretUpFill } from './icons/caret-up-fill';
import { DsReactIconCashflowCompensation } from './icons/cashflow-compensation';
import { DsReactIconCashflowDeposit } from './icons/cashflow-deposit';
import { DsReactIconCashflowEtoroCredit } from './icons/cashflow-etoro-credit';
import { DsReactIconCashflowWithdrawal } from './icons/cashflow-withdrawal';
import { DsReactIconChangeChart } from './icons/change-chart';
import { DsReactIconChangeChartFill } from './icons/change-chart-fill';
import { DsReactIconChartCandlestickAlt } from './icons/chart-candlestick-alt';
import { DsReactIconChartCandlestickAltFill } from './icons/chart-candlestick-alt-fill';
import { DsReactIconChartColumnAlt } from './icons/chart-column-alt';
import { DsReactIconChartColumnAltFill } from './icons/chart-column-alt-fill';
import { DsReactIconChartGradient } from './icons/chart-gradient';
import { DsReactIconChartLine } from './icons/chart-line';
import { DsReactIconChartLineDown } from './icons/chart-line-down';
import { DsReactIconChartLineDownFill } from './icons/chart-line-down-fill';
import { DsReactIconChartLineDownSimple } from './icons/chart-line-down-simple';
import { DsReactIconChartLineDownSimpleFill } from './icons/chart-line-down-simple-fill';
import { DsReactIconChartLineFill } from './icons/chart-line-fill';
import { DsReactIconChartLineGradient } from './icons/chart-line-gradient';
import { DsReactIconChartLineSimple } from './icons/chart-line-simple';
import { DsReactIconChartLineSimpleFill } from './icons/chart-line-simple-fill';
import { DsReactIconChartLineUp } from './icons/chart-line-up';
import { DsReactIconChartLineUpFill } from './icons/chart-line-up-fill';
import { DsReactIconChartLineUpSimple } from './icons/chart-line-up-simple';
import { DsReactIconChartLineUpSimpleFill } from './icons/chart-line-up-simple-fill';
import { DsReactIconChartPie } from './icons/chart-pie';
import { DsReactIconChartPieFill } from './icons/chart-pie-fill';
import { DsReactIconChartPieSimple } from './icons/chart-pie-simple';
import { DsReactIconChartPieSimpleFill } from './icons/chart-pie-simple-fill';
import { DsReactIconChartSimple } from './icons/chart-simple';
import { DsReactIconChartSimpleFill } from './icons/chart-simple-fill';
import { DsReactIconCheck } from './icons/check';
import { DsReactIconCheckCircle } from './icons/check-circle';
import { DsReactIconCheckCircleFill } from './icons/check-circle-fill';
import { DsReactIconCheckFill } from './icons/check-fill';
import { DsReactIconClock } from './icons/clock';
import { DsReactIconClockFill } from './icons/clock-fill';
import { DsReactIconCloseTrade } from './icons/close-trade';
import { DsReactIconCollapseFillLeft } from './icons/collapse-fill-left';
import { DsReactIconCollapseFillRight } from './icons/collapse-fill-right';
import { DsReactIconColumns } from './icons/columns';
import { DsReactIconComment } from './icons/comment';
import { DsReactIconCommentFill } from './icons/comment-fill';
import { DsReactIconCompensation } from './icons/compensation';
import { DsReactIconControl } from './icons/control';
import { DsReactIconCopy } from './icons/copy';
import { DsReactIconCopyFill } from './icons/copy-fill';
import { DsReactIconCoupon } from './icons/coupon';
import { DsReactIconCreditCard } from './icons/credit-card';
import { DsReactIconCreditCardFill } from './icons/credit-card-fill';
import { DsReactIconCurrency } from './icons/currency';
import { DsReactIconDepositWallet } from './icons/deposit-wallet';
import { DsReactIconDepositWalletFill } from './icons/deposit-wallet-fill';
import { DsReactIconDirectPayment } from './icons/direct-payment';
import { DsReactIconDirectPaymentFill } from './icons/direct-payment-fill';
import { DsReactIconDisconnectedFill } from './icons/disconnected-fill';
import { DsReactIconDiscover } from './icons/discover';
import { DsReactIconDiscoverFill } from './icons/discover-fill';
import { DsReactIconDisplay } from './icons/display';
import { DsReactIconDisplayDesktop } from './icons/display-desktop';
import { DsReactIconDivident } from './icons/divident';
import { DsReactIconDocument } from './icons/document';
import { DsReactIconDollarSign } from './icons/dollar-sign';
import { DsReactIconDotFill } from './icons/dot-fill';
import { DsReactIconDotFill1 } from './icons/dot-fill-1';
import { DsReactIconDragFill } from './icons/drag-fill';
import { DsReactIconEasyTransfer } from './icons/easy-transfer';
import { DsReactIconEdit } from './icons/edit';
import { DsReactIconEditSltp } from './icons/edit-sltp';
import { DsReactIconEmail } from './icons/email';
import { DsReactIconEtoroFill } from './icons/etoro-fill';
import { DsReactIconEtoroMoney } from './icons/etoro-money';
import { DsReactIconEurFill } from './icons/eur-fill';
import { DsReactIconExclamation } from './icons/exclamation';
import { DsReactIconExclamationFill } from './icons/exclamation-fill';
import { DsReactIconEye } from './icons/eye';
import { DsReactIconEyeFill } from './icons/eye-fill';
import { DsReactIconEyeSlash } from './icons/eye-slash';
import { DsReactIconFemale } from './icons/female';
import { DsReactIconFilter } from './icons/filter';
import { DsReactIconFilterCheck } from './icons/filter-check';
import { DsReactIconFilterCheckFill } from './icons/filter-check-fill';
import { DsReactIconFilterFill } from './icons/filter-fill';
import { DsReactIconFolder } from './icons/folder';
import { DsReactIconFolderFill } from './icons/folder-fill';
import { DsReactIconFreezeCard } from './icons/freeze-card';
import { DsReactIconGbpFill } from './icons/gbp-fill';
import { DsReactIconGear } from './icons/gear';
import { DsReactIconGearFill } from './icons/gear-fill';
import { DsReactIconGlobe } from './icons/globe';
import { DsReactIconGoogleFill } from './icons/google-fill';
import { DsReactIconGridSquare } from './icons/grid-square';
import { DsReactIconGridSquareFill } from './icons/grid-square-fill';
import { DsReactIconHelp } from './icons/help';
import { DsReactIconHome } from './icons/home';
import { DsReactIconHomeFill } from './icons/home-fill';
import { DsReactIconImage } from './icons/image';
import { DsReactIconImageFill } from './icons/image-fill';
import { DsReactIconInApp } from './icons/in-app';
import { DsReactIconInfoCircle } from './icons/info-circle';
import { DsReactIconInfoFill } from './icons/info-fill';
import { DsReactIconIphone } from './icons/iphone';
import { DsReactIconIphoneFill } from './icons/iphone-fill';
import { DsReactIconJumpTop } from './icons/jump-top';
import { DsReactIconKey } from './icons/key';
import { DsReactIconKeyboard } from './icons/keyboard';
import { DsReactIconKeyboardFill } from './icons/keyboard-fill';
import { DsReactIconLike } from './icons/like';
import { DsReactIconLikeFill } from './icons/like-fill';
import { DsReactIconLimitOrder } from './icons/limit-order';
import { DsReactIconLinkHorizontal } from './icons/link-horizontal';
import { DsReactIconLocationPin } from './icons/location-pin';
import { DsReactIconLocationPinFill } from './icons/location-pin-fill';
import { DsReactIconLock } from './icons/lock';
import { DsReactIconLockFill } from './icons/lock-fill';
import { DsReactIconLogout } from './icons/logout';
import { DsReactIconMale } from './icons/male';
import { DsReactIconManageWorkspace } from './icons/manage-workspace';
import { DsReactIconMarketClosed } from './icons/market-closed';
import { DsReactIconMarketClosedFill } from './icons/market-closed-fill';
import { DsReactIconMarketOpen } from './icons/market-open';
import { DsReactIconMarketOpenFill } from './icons/market-open-fill';
import { DsReactIconMarketOrder } from './icons/market-order';
import { DsReactIconMenu } from './icons/menu';
import { DsReactIconMetaFill } from './icons/meta-fill';
import { DsReactIconMinus } from './icons/minus';
import { DsReactIconMinusFill } from './icons/minus-fill';
import { DsReactIconMobile } from './icons/mobile';
import { DsReactIconMobileFill } from './icons/mobile-fill';
import { DsReactIconMoneyIn } from './icons/money-in';
import { DsReactIconMoneyOut } from './icons/money-out';
import { DsReactIconMore } from './icons/more';
import { DsReactIconNotification } from './icons/notification';
import { DsReactIconNotification1 } from './icons/notification-1';
import { DsReactIconNotificationFill } from './icons/notification-fill';
import { DsReactIconNotificationFill1 } from './icons/notification-fill-1';
import { DsReactIconPen } from './icons/pen';
import { DsReactIconPenFill } from './icons/pen-fill';
import { DsReactIconPhoneIncoming } from './icons/phone-incoming';
import { DsReactIconPhoneIncomingFill } from './icons/phone-incoming-fill';
import { DsReactIconPin } from './icons/pin';
import { DsReactIconPinCode } from './icons/pin-code';
import { DsReactIconPinFill } from './icons/pin-fill';
import { DsReactIconPlay } from './icons/play';
import { DsReactIconPlayCircle } from './icons/play-circle';
import { DsReactIconPlayCircleFill } from './icons/play-circle-fill';
import { DsReactIconPlayFill } from './icons/play-fill';
import { DsReactIconPlus } from './icons/plus';
import { DsReactIconPlusCircle } from './icons/plus-circle';
import { DsReactIconPlusCircleFill } from './icons/plus-circle-fill';
import { DsReactIconPlusFill } from './icons/plus-fill';
import { DsReactIconPolls } from './icons/polls';
import { DsReactIconPortfolio } from './icons/portfolio';
import { DsReactIconPortfolioFill } from './icons/portfolio-fill';
import { DsReactIconPreMarket } from './icons/pre-market';
import { DsReactIconPreMarketFill } from './icons/pre-market-fill';
import { DsReactIconRecordFill } from './icons/record-fill';
import { DsReactIconSearch } from './icons/search';
import { DsReactIconSearch1 } from './icons/search-1';
import { DsReactIconSearchFill } from './icons/search-fill';
import { DsReactIconSendFill } from './icons/send-fill';
import { DsReactIconShare } from './icons/share';
import { DsReactIconShareFill } from './icons/share-fill';
import { DsReactIconSharePayment } from './icons/share-payment';
import { DsReactIconSharePaymentFill } from './icons/share-payment-fill';
import { DsReactIconShield } from './icons/shield';
import { DsReactIconSmartPortfolio } from './icons/smart-portfolio';
import { DsReactIconSocial } from './icons/social';
import { DsReactIconSocialFill } from './icons/social-fill';
import { DsReactIconSort } from './icons/sort';
import { DsReactIconSortDescending } from './icons/sort-descending';
import { DsReactIconSortFill } from './icons/sort-fill';
import { DsReactIconSpamFlag } from './icons/spam-flag';
import { DsReactIconSpamFlagFill } from './icons/spam-flag-fill';
import { DsReactIconSpamUnflag } from './icons/spam-unflag';
import { DsReactIconSparklesDark } from './icons/sparkles-dark';
import { DsReactIconSparklesLight } from './icons/sparkles-light';
import { DsReactIconStar } from './icons/star';
import { DsReactIconStarFill } from './icons/star-fill';
import { DsReactIconSubmitDocument } from './icons/submit-document';
import { DsReactIconTag } from './icons/tag';
import { DsReactIconToriLogo } from './icons/tori-logo';
import { DsReactIconTrashSimple } from './icons/trash-simple';
import { DsReactIconTrashSimpleFill } from './icons/trash-simple-fill';
import { DsReactIconUnblockAccount } from './icons/unblock-account';
import { DsReactIconUndoFreezeCard } from './icons/undo-freeze-card';
import { DsReactIconUnlock } from './icons/unlock';
import { DsReactIconUnlockFill } from './icons/unlock-fill';
import { DsReactIconUnpin } from './icons/unpin';
import { DsReactIconUpload } from './icons/upload';
import { DsReactIconUsdFill } from './icons/usd-fill';
import { DsReactIconVolume } from './icons/volume';
import { DsReactIconVolumeFill } from './icons/volume-fill';
import { DsReactIconVolumeSlash } from './icons/volume-slash';
import { DsReactIconVolumeSlashFill } from './icons/volume-slash-fill';
import { DsReactIconWatchlist } from './icons/watchlist';
import { DsReactIconWatchlistFill } from './icons/watchlist-fill';
import { DsReactIconWhatsAppFill } from './icons/whats-app-fill';
import { DsReactIconWriteFill } from './icons/write-fill';
import { DsReactIconXmark } from './icons/xmark';
import { DsReactIconXmarkCircle } from './icons/xmark-circle';
import { DsReactIconXmarkCircleFill } from './icons/xmark-circle-fill';
import { DsReactIconXmarkFill } from './icons/xmark-fill';

export type { DsReactLocalIconProps } from './ds-react-local-icon-props';

/**
 * Figma-exported DS — React icons (generated — do not hand-edit imports).
 */
export const DS_REACT_ICON_REGISTRY: Partial<Record<DsReactIconName, ComponentType<DsReactLocalIconProps>>> = {
  academy: DsReactIconAcademy,
  account: DsReactIconAccount,
  'add-card': DsReactIconAddCard,
  'add-to-watchlist': DsReactIconAddToWatchlist,
  'add-to-watchlist-1': DsReactIconAddToWatchlist1,
  'add-trade': DsReactIconAddTrade,
  'add-trade-fill': DsReactIconAddTradeFill,
  'after-hours': DsReactIconAfterHours,
  'after-hours-fill': DsReactIconAfterHoursFill,
  'alert-circle': DsReactIconAlertCircle,
  'alert-circle-fill': DsReactIconAlertCircleFill,
  'alert-notification': DsReactIconAlertNotification,
  'alert-notification-fill': DsReactIconAlertNotificationFill,
  'angle-down': DsReactIconAngleDown,
  'angle-down-fill': DsReactIconAngleDownFill,
  'angle-down-small': DsReactIconAngleDownSmall,
  'angle-down-small-fill': DsReactIconAngleDownSmallFill,
  'angle-left': DsReactIconAngleLeft,
  'angle-left-fill': DsReactIconAngleLeftFill,
  'angle-left-small': DsReactIconAngleLeftSmall,
  'angle-left-small-fill': DsReactIconAngleLeftSmallFill,
  'angle-right': DsReactIconAngleRight,
  'angle-right-fill': DsReactIconAngleRightFill,
  'angle-right-small': DsReactIconAngleRightSmall,
  'angle-right-small-fill': DsReactIconAngleRightSmallFill,
  'angle-up': DsReactIconAngleUp,
  'angle-up-fill': DsReactIconAngleUpFill,
  'angle-up-small': DsReactIconAngleUpSmall,
  'angle-up-small-fill': DsReactIconAngleUpSmallFill,
  'angles-up-down': DsReactIconAnglesUpDown,
  'angles-up-down-fill': DsReactIconAnglesUpDownFill,
  'apple-fill': DsReactIconAppleFill,
  'arrow-down': DsReactIconArrowDown,
  'arrow-down-fill': DsReactIconArrowDownFill,
  'arrow-down-left-small': DsReactIconArrowDownLeftSmall,
  'arrow-down-left-small-fill': DsReactIconArrowDownLeftSmallFill,
  'arrow-down-right-small': DsReactIconArrowDownRightSmall,
  'arrow-down-right-small-fill': DsReactIconArrowDownRightSmallFill,
  'arrow-left': DsReactIconArrowLeft,
  'arrow-left-fill': DsReactIconArrowLeftFill,
  'arrow-redo': DsReactIconArrowRedo,
  'arrow-redo-fill': DsReactIconArrowRedoFill,
  'arrow-right': DsReactIconArrowRight,
  'arrow-right-fill': DsReactIconArrowRightFill,
  'arrow-right-left': DsReactIconArrowRightLeft,
  'arrow-right-left-fill': DsReactIconArrowRightLeftFill,
  'arrow-up': DsReactIconArrowUp,
  'arrow-up-fill': DsReactIconArrowUpFill,
  'arrow-up-left': DsReactIconArrowUpLeft,
  'arrow-up-left-fill': DsReactIconArrowUpLeftFill,
  'arrow-up-right': DsReactIconArrowUpRight,
  'arrow-up-right-fill': DsReactIconArrowUpRightFill,
  'arrows-collapessed': DsReactIconArrowsCollapessed,
  'arrows-expand': DsReactIconArrowsExpand,
  'arrows-expand-fill': DsReactIconArrowsExpandFill,
  'arrows-repeat': DsReactIconArrowsRepeat,
  'arrows-repeat-fill': DsReactIconArrowsRepeatFill,
  atm: DsReactIconAtm,
  attach: DsReactIconAttach,
  'bank-payment': DsReactIconBankPayment,
  'bank-payment-fill': DsReactIconBankPaymentFill,
  'bell-plus': DsReactIconBellPlus,
  'bell-plus-fill': DsReactIconBellPlusFill,
  'bell-ring': DsReactIconBellRing,
  'bell-ring-fill': DsReactIconBellRingFill,
  'big-dot-fill': DsReactIconBigDotFill,
  'block-account': DsReactIconBlockAccount,
  'block-card': DsReactIconBlockCard,
  bookmark: DsReactIconBookmark,
  'bookmark-fill': DsReactIconBookmarkFill,
  'btc-fill': DsReactIconBtcFill,
  bullhorn: DsReactIconBullhorn,
  calendar: DsReactIconCalendar,
  'calendar-fill': DsReactIconCalendarFill,
  camera: DsReactIconCamera,
  'camera-fill': DsReactIconCameraFill,
  'cashflow-compensation': DsReactIconCashflowCompensation,
  'cashflow-deposit': DsReactIconCashflowDeposit,
  'cashflow-etoro-credit': DsReactIconCashflowEtoroCredit,
  'cashflow-withdrawal': DsReactIconCashflowWithdrawal,
  'caret-down': DsReactIconCaretDown,
  'caret-down-fill': DsReactIconCaretDownFill,
  'caret-fill-down': DsReactIconCaretFillDown,
  'caret-fill-up': DsReactIconCaretFillUp,
  'caret-up': DsReactIconCaretUp,
  'caret-up-fill': DsReactIconCaretUpFill,
  'change-chart': DsReactIconChangeChart,
  'change-chart-fill': DsReactIconChangeChartFill,
  'chart-candlestick-alt': DsReactIconChartCandlestickAlt,
  'chart-candlestick-alt-fill': DsReactIconChartCandlestickAltFill,
  'chart-column-alt': DsReactIconChartColumnAlt,
  'chart-column-alt-fill': DsReactIconChartColumnAltFill,
  'chart-gradient': DsReactIconChartGradient,
  'chart-line': DsReactIconChartLine,
  'chart-line-down': DsReactIconChartLineDown,
  'chart-line-down-fill': DsReactIconChartLineDownFill,
  'chart-line-down-simple': DsReactIconChartLineDownSimple,
  'chart-line-down-simple-fill': DsReactIconChartLineDownSimpleFill,
  'chart-line-fill': DsReactIconChartLineFill,
  'chart-line-gradient': DsReactIconChartLineGradient,
  'chart-line-simple': DsReactIconChartLineSimple,
  'chart-line-simple-fill': DsReactIconChartLineSimpleFill,
  'chart-line-up': DsReactIconChartLineUp,
  'chart-line-up-fill': DsReactIconChartLineUpFill,
  'chart-line-up-simple': DsReactIconChartLineUpSimple,
  'chart-line-up-simple-fill': DsReactIconChartLineUpSimpleFill,
  'chart-pie': DsReactIconChartPie,
  'chart-pie-fill': DsReactIconChartPieFill,
  'chart-pie-simple': DsReactIconChartPieSimple,
  'chart-pie-simple-fill': DsReactIconChartPieSimpleFill,
  'chart-simple': DsReactIconChartSimple,
  'chart-simple-fill': DsReactIconChartSimpleFill,
  check: DsReactIconCheck,
  'check-circle': DsReactIconCheckCircle,
  'check-circle-fill': DsReactIconCheckCircleFill,
  'check-fill': DsReactIconCheckFill,
  clock: DsReactIconClock,
  'clock-fill': DsReactIconClockFill,
  'close-trade': DsReactIconCloseTrade,
  'collapse-fill-left': DsReactIconCollapseFillLeft,
  'collapse-fill-right': DsReactIconCollapseFillRight,
  columns: DsReactIconColumns,
  comment: DsReactIconComment,
  'comment-fill': DsReactIconCommentFill,
  compensation: DsReactIconCompensation,
  control: DsReactIconControl,
  copy: DsReactIconCopy,
  'copy-fill': DsReactIconCopyFill,
  coupon: DsReactIconCoupon,
  'credit-card': DsReactIconCreditCard,
  'credit-card-fill': DsReactIconCreditCardFill,
  currency: DsReactIconCurrency,
  'deposit-wallet': DsReactIconDepositWallet,
  'deposit-wallet-fill': DsReactIconDepositWalletFill,
  'direct-payment': DsReactIconDirectPayment,
  'direct-payment-fill': DsReactIconDirectPaymentFill,
  'disconnected-fill': DsReactIconDisconnectedFill,
  discover: DsReactIconDiscover,
  'discover-fill': DsReactIconDiscoverFill,
  display: DsReactIconDisplay,
  'display-desktop': DsReactIconDisplayDesktop,
  divident: DsReactIconDivident,
  document: DsReactIconDocument,
  'dollar-sign': DsReactIconDollarSign,
  'dot-fill': DsReactIconDotFill,
  'dot-fill-1': DsReactIconDotFill1,
  'drag-fill': DsReactIconDragFill,
  'easy-transfer': DsReactIconEasyTransfer,
  edit: DsReactIconEdit,
  'edit-sltp': DsReactIconEditSltp,
  email: DsReactIconEmail,
  'etoro-fill': DsReactIconEtoroFill,
  'etoro-money': DsReactIconEtoroMoney,
  'eur-fill': DsReactIconEurFill,
  exclamation: DsReactIconExclamation,
  'exclamation-fill': DsReactIconExclamationFill,
  eye: DsReactIconEye,
  'eye-fill': DsReactIconEyeFill,
  'eye-slash': DsReactIconEyeSlash,
  female: DsReactIconFemale,
  filter: DsReactIconFilter,
  'filter-check': DsReactIconFilterCheck,
  'filter-check-fill': DsReactIconFilterCheckFill,
  'filter-fill': DsReactIconFilterFill,
  folder: DsReactIconFolder,
  'folder-fill': DsReactIconFolderFill,
  'freeze-card': DsReactIconFreezeCard,
  'gbp-fill': DsReactIconGbpFill,
  gear: DsReactIconGear,
  'gear-fill': DsReactIconGearFill,
  'google-fill': DsReactIconGoogleFill,
  globe: DsReactIconGlobe,
  'grid-square': DsReactIconGridSquare,
  'grid-square-fill': DsReactIconGridSquareFill,
  help: DsReactIconHelp,
  home: DsReactIconHome,
  'home-fill': DsReactIconHomeFill,
  image: DsReactIconImage,
  'image-fill': DsReactIconImageFill,
  'in-app': DsReactIconInApp,
  'info-circle': DsReactIconInfoCircle,
  'info-fill': DsReactIconInfoFill,
  iphone: DsReactIconIphone,
  'iphone-fill': DsReactIconIphoneFill,
  'jump-top': DsReactIconJumpTop,
  key: DsReactIconKey,
  keyboard: DsReactIconKeyboard,
  'keyboard-fill': DsReactIconKeyboardFill,
  like: DsReactIconLike,
  'like-fill': DsReactIconLikeFill,
  'limit-order': DsReactIconLimitOrder,
  'link-horizontal': DsReactIconLinkHorizontal,
  'location-pin': DsReactIconLocationPin,
  'location-pin-fill': DsReactIconLocationPinFill,
  lock: DsReactIconLock,
  'lock-fill': DsReactIconLockFill,
  logout: DsReactIconLogout,
  male: DsReactIconMale,
  'manage-workspace': DsReactIconManageWorkspace,
  'market-closed': DsReactIconMarketClosed,
  'market-closed-fill': DsReactIconMarketClosedFill,
  'market-open': DsReactIconMarketOpen,
  'market-open-fill': DsReactIconMarketOpenFill,
  'market-order': DsReactIconMarketOrder,
  menu: DsReactIconMenu,
  'meta-fill': DsReactIconMetaFill,
  minus: DsReactIconMinus,
  'minus-fill': DsReactIconMinusFill,
  mobile: DsReactIconMobile,
  'mobile-fill': DsReactIconMobileFill,
  'money-in': DsReactIconMoneyIn,
  'money-out': DsReactIconMoneyOut,
  more: DsReactIconMore,
  notification: DsReactIconNotification,
  'notification-1': DsReactIconNotification1,
  'notification-fill': DsReactIconNotificationFill,
  'notification-fill-1': DsReactIconNotificationFill1,
  pen: DsReactIconPen,
  'pen-fill': DsReactIconPenFill,
  'phone-incoming': DsReactIconPhoneIncoming,
  'phone-incoming-fill': DsReactIconPhoneIncomingFill,
  pin: DsReactIconPin,
  'pin-code': DsReactIconPinCode,
  'pin-fill': DsReactIconPinFill,
  play: DsReactIconPlay,
  'play-circle': DsReactIconPlayCircle,
  'play-circle-fill': DsReactIconPlayCircleFill,
  'play-fill': DsReactIconPlayFill,
  plus: DsReactIconPlus,
  'plus-circle': DsReactIconPlusCircle,
  'plus-circle-fill': DsReactIconPlusCircleFill,
  'plus-fill': DsReactIconPlusFill,
  polls: DsReactIconPolls,
  portfolio: DsReactIconPortfolio,
  'portfolio-fill': DsReactIconPortfolioFill,
  'pre-market': DsReactIconPreMarket,
  'pre-market-fill': DsReactIconPreMarketFill,
  'record-fill': DsReactIconRecordFill,
  search: DsReactIconSearch,
  'search-1': DsReactIconSearch1,
  'search-fill': DsReactIconSearchFill,
  'send-fill': DsReactIconSendFill,
  share: DsReactIconShare,
  'share-fill': DsReactIconShareFill,
  'share-payment': DsReactIconSharePayment,
  'share-payment-fill': DsReactIconSharePaymentFill,
  shield: DsReactIconShield,
  'smart-portfolio': DsReactIconSmartPortfolio,
  social: DsReactIconSocial,
  'social-fill': DsReactIconSocialFill,
  sort: DsReactIconSort,
  'sort-descending': DsReactIconSortDescending,
  'sort-fill': DsReactIconSortFill,
  'spam-flag': DsReactIconSpamFlag,
  'spam-flag-fill': DsReactIconSpamFlagFill,
  'spam-unflag': DsReactIconSpamUnflag,
  'sparkles-dark': DsReactIconSparklesDark,
  'sparkles-light': DsReactIconSparklesLight,
  star: DsReactIconStar,
  'star-fill': DsReactIconStarFill,
  'submit-document': DsReactIconSubmitDocument,
  tag: DsReactIconTag,
  'tori-logo': DsReactIconToriLogo,
  'trash-simple': DsReactIconTrashSimple,
  'trash-simple-fill': DsReactIconTrashSimpleFill,
  'unblock-account': DsReactIconUnblockAccount,
  'undo-freeze-card': DsReactIconUndoFreezeCard,
  unlock: DsReactIconUnlock,
  'unlock-fill': DsReactIconUnlockFill,
  unpin: DsReactIconUnpin,
  upload: DsReactIconUpload,
  'usd-fill': DsReactIconUsdFill,
  volume: DsReactIconVolume,
  'volume-fill': DsReactIconVolumeFill,
  'volume-slash': DsReactIconVolumeSlash,
  'volume-slash-fill': DsReactIconVolumeSlashFill,
  watchlist: DsReactIconWatchlist,
  'watchlist-fill': DsReactIconWatchlistFill,
  'whats-app-fill': DsReactIconWhatsAppFill,
  'write-fill': DsReactIconWriteFill,
  xmark: DsReactIconXmark,
  'xmark-circle': DsReactIconXmarkCircle,
  'xmark-circle-fill': DsReactIconXmarkCircleFill,
  'xmark-fill': DsReactIconXmarkFill,
};
