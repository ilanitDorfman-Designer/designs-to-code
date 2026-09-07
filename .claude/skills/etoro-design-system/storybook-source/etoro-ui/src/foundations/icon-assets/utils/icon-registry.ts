// NATIVE TWIN: the advanced watchlist table renders the caret-up and chevron glyphs natively on iOS (SwiftUI) and
// Android (Compose) — apps/etoro-mobile/modules/advanced-table/ios/EtNativeIcons.swift and
// apps/etoro-mobile/modules/advanced-table/android/.../EtNativeIcons.kt. A change here must be mirrored in both;
// see apps/etoro-mobile/modules/advanced-table/AGENTS.md for the full map.
// Import all icon components
import type { ComponentType } from 'react';

import Academy from '../../../core/icons/academy';
import { AfterHours } from '../../../core/icons/after-hours';
import Ai from '../../../core/icons/ai';
import AllAccounts from '../../../core/icons/all-accounts';
import Apple from '../../../core/icons/apple';
import AppleDark from '../../../core/icons/apple-dark';
import Arrow from '../../../core/icons/arrow';
import ArrowDownFill from '../../../core/icons/arrow-down-fill';
import ArrowGain from '../../../core/icons/arrow-gain';
import ArrowLoss from '../../../core/icons/arrow-loss';
import ArrowUpFill from '../../../core/icons/arrow-up-fill';
import BarChart from '../../../core/icons/bar-chart';
import Btc from '../../../core/icons/btc';
import { Bullish } from '../../../core/icons/bullish';
import { BullishArrow } from '../../../core/icons/bullish-arrow';
import Calendar from '../../../core/icons/calendar';
import CaretDown from '../../../core/icons/caret-down';
import CaretUp from '../../../core/icons/caret-up';
import Chat from '../../../core/icons/chat';
import CheckCircle from '../../../core/icons/check-circle';
import CheckLine from '../../../core/icons/check-line';
import Checked from '../../../core/icons/checked';
import ChevronDown from '../../../core/icons/chevron-down';
import ChevronLeft from '../../../core/icons/chevron-left';
import ChevronRight from '../../../core/icons/chevron-right';
import ChevronUp from '../../../core/icons/chevron-up';
import Close from '../../../core/icons/close';
import CloseSmall from '../../../core/icons/close-small';
import Coins from '../../../core/icons/coins';
import Comment from '../../../core/icons/comment';
import Copy from '../../../core/icons/copy';
import CreditCard from '../../../core/icons/credit-card';
import DeleteText from '../../../core/icons/delete-text';
import Deposit from '../../../core/icons/deposit';
import Discover from '../../../core/icons/discover';
import Display from '../../../core/icons/display';
import { ErrorIcon } from '../../../core/icons/error';
import EtorianClub from '../../../core/icons/etorian-club';
import { ExclamationCircleLine } from '../../../core/icons/exclamation-circle-line';
import { Expand } from '../../../core/icons/expand';
import Eye from '../../../core/icons/eye';
import EyeOff from '../../../core/icons/eye-off';
import FaceId from '../../../core/icons/face-id';
import Fingerprint from '../../../core/icons/fingerprint';
import Gainers from '../../../core/icons/gainers';
import Google from '../../../core/icons/google';
import GoogleDark from '../../../core/icons/google-dark';
import Heart from '../../../core/icons/heart';
import HistoryIcon from '../../../core/icons/history-icon';
import Home from '../../../core/icons/home';
import { InfoCircleFill } from '../../../core/icons/info-circle-fill';
import { InfoCircleLine } from '../../../core/icons/info-circle-line';
import InviteFriends from '../../../core/icons/invite-friends';
import IssueReport from '../../../core/icons/issue-report';
import Like from '../../../core/icons/like';
import Loader from '../../../core/icons/loader';
import Logout from '../../../core/icons/logout';
import Losers from '../../../core/icons/losers';
import Mail from '../../../core/icons/mail';
import Map from '../../../core/icons/map';
import Menu from '../../../core/icons/menu';
import MetaDark from '../../../core/icons/meta-dark';
import Minus from '../../../core/icons/minus';
import { IconProps } from '../../../core/icons/models/icon-props';
import More from '../../../core/icons/more';
import MoreVertical from '../../../core/icons/more-vertical';
import News from '../../../core/icons/news';
import Notification from '../../../core/icons/notification';
import Plus from '../../../core/icons/plus';
import PlusLine from '../../../core/icons/plus-line';
import PopularInvestor from '../../../core/icons/popular-investor';
import Portfolio from '../../../core/icons/portfolio';
import { PriceAlert } from '../../../core/icons/price-alert';
import Privacy from '../../../core/icons/privacy';
import ProInvestor from '../../../core/icons/pro-investor';
import Search from '../../../core/icons/search';
import SearchLine from '../../../core/icons/search-line';
import Settings from '../../../core/icons/settings';
import Share from '../../../core/icons/share';
import SortDescending from '../../../core/icons/sort-descending';
import Star from '../../../core/icons/star';
import Support from '../../../core/icons/support';
import SwitchUnits from '../../../core/icons/switch-units';
import Torii from '../../../core/icons/torii';
import { Trade } from '../../../core/icons/trade';
import Trading from '../../../core/icons/trading';
import { Trash } from '../../../core/icons/trash';
import TriangleDown from '../../../core/icons/triangle-down';
import TriangleUp from '../../../core/icons/triangle-up';
import UpcomingEvent from '../../../core/icons/upcoming-event';
import User from '../../../core/icons/user';
import { V } from '../../../core/icons/v';
import Wallet from '../../../core/icons/wallet';
import Watched from '../../../core/icons/watched';
import Watchlist from '../../../core/icons/watchlist';
import { WifiOff } from '../../../core/icons/wifi-off';
import { WifiSlow } from '../../../core/icons/wifi-slow';
import Yeild from '../../../core/icons/yeild';
import { IconMetadata, IconName } from '../api';

// Icon component registry
export const iconRegistry: Record<IconName, ComponentType<IconProps>> = {
  // Navigation icons
  allAccounts: AllAccounts,
  map: Map,
  home: Home,
  search: Search,
  searchLine: SearchLine,
  portfolio: Portfolio,
  discover: Discover,
  watchlist: Watchlist,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  menu: Menu,
  sortDescending: SortDescending,

  // User & Account icons
  user: User,
  settings: Settings,
  logout: Logout,
  faceId: FaceId,
  fingerPrint: Fingerprint,
  privacy: Privacy,
  support: Support,

  // Trading & Finance icons
  arrowGain: ArrowGain,
  arrowLoss: ArrowLoss,
  arrowUpFill: ArrowUpFill,
  arrowDownFill: ArrowDownFill,
  trading: Trading,
  wallet: Wallet,
  coins: Coins,
  deposit: Deposit,
  creditCard: CreditCard,
  btc: Btc,
  gainers: Gainers,
  losers: Losers,
  yeild: Yeild,
  barChart: BarChart,

  // Actions icons
  plus: Plus,
  plusLine: PlusLine,
  minus: Minus,
  close: Close,
  closeSmall: CloseSmall,
  deleteText: DeleteText,
  heart: Heart,
  star: Star,
  like: Like,
  share: Share,
  copy: Copy,
  comment: Comment,
  more: More,
  moreVertical: MoreVertical,
  checked: Checked,
  checkCircle: CheckCircle,
  checkLine: CheckLine,
  triangleUp: TriangleUp,
  triangleDown: TriangleDown,
  caretUp: CaretUp,
  caretDown: CaretDown,

  // Brand icons
  apple: Apple,
  appleDark: AppleDark,
  metaDark: MetaDark,
  google: Google,
  googleDark: GoogleDark,
  etorianClub: EtorianClub,
  'pro-investor': ProInvestor,
  'popular-investor': PopularInvestor,
  torii: Torii,

  // UI & Interface icons
  chat: Chat,
  mail: Mail,
  notification: Notification,
  display: Display,
  eye: Eye,
  eyeOff: EyeOff,
  calendar: Calendar,
  academy: Academy,
  inviteFriends: InviteFriends,
  news: News,
  upcomingEvent: UpcomingEvent,
  ai: Ai,
  watched: Watched,
  switchUnits: SwitchUnits,
  trade: Trade,
  priceAlert: PriceAlert,
  trash: Trash,
  loader: Loader,
  expand: Expand,
  bullishArrow: BullishArrow,
  afterHours: AfterHours,
  bullish: Bullish,
  v: V,
  arrow: Arrow,
  error: ErrorIcon,
  exclamationCircleLine: ExclamationCircleLine,
  infoCircleLine: InfoCircleLine,
  infoCircleFill: InfoCircleFill,
  history: HistoryIcon,
  wifiOff: WifiOff,
  wifiSlow: WifiSlow,
  issueReport: IssueReport,
};

// Icon metadata registry
export const iconMetadata: Record<IconName, IconMetadata> = {
  // Navigation
  map: {
    name: 'map',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['location', 'navigation', 'gps'],
  },
  home: {
    name: 'home',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['dashboard', 'main'],
  },
  search: {
    name: 'search',
    category: 'navigation',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['find', 'magnify'],
  },
  searchLine: {
    name: 'searchLine',
    category: 'navigation',
    supportsFill: true,
    defaultSize: 16,
    keywords: ['find', 'magnify', 'lookup'],
  },
  allAccounts: {
    name: 'allAccounts',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 20,
    keywords: ['accounts', 'layers', 'stack', 'combined'],
  },
  portfolio: {
    name: 'portfolio',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['investments', 'holdings'],
  },
  discover: {
    name: 'discover',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['explore', 'find'],
  },
  watchlist: {
    name: 'watchlist',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['favorites', 'saved'],
  },
  chevronRight: {
    name: 'chevronRight',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 16,
    keywords: ['arrow', 'next', 'forward'],
  },
  chevronLeft: {
    name: 'chevronLeft',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 16,
    keywords: ['arrow', 'back', 'previous'],
  },
  chevronDown: {
    name: 'chevronDown',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 16,
    keywords: ['arrow', 'down', 'next'],
  },
  chevronUp: {
    name: 'chevronUp',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 16,
    keywords: ['arrow', 'up', 'previous'],
  },
  menu: {
    name: 'menu',
    category: 'navigation',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['hamburger', 'options'],
  },
  sortDescending: {
    name: 'sortDescending',
    category: 'ui',
    supportsFill: false,
    defaultSize: 18,
    keywords: ['sort', 'filter', 'order', 'descending'],
  },

  // User & Account
  user: {
    name: 'user',
    category: 'user',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['profile', 'account', 'person'],
  },
  settings: {
    name: 'settings',
    category: 'user',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['preferences', 'configuration'],
  },
  logout: {
    name: 'logout',
    category: 'user',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['signout', 'exit'],
  },
  faceId: {
    name: 'faceId',
    category: 'user',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['biometric', 'authentication'],
  },
  fingerPrint: {
    name: 'fingerPrint',
    category: 'user',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['biometric', 'authentication'],
  },
  privacy: {
    name: 'privacy',
    category: 'user',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['security', 'protection'],
  },
  support: {
    name: 'support',
    category: 'user',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['help', 'assistance'],
  },

  // Trading & Finance
  arrowGain: {
    name: 'arrowGain',
    category: 'trading',
    supportsFill: false,
    defaultSize: 16,
    keywords: ['up', 'positive', 'gain', 'arrow', 'increase'],
  },
  arrowLoss: {
    name: 'arrowLoss',
    category: 'trading',
    supportsFill: false,
    defaultSize: 16,
    keywords: ['down', 'negative', 'loss', 'arrow', 'decrease'],
  },
  arrowUpFill: {
    name: 'arrowUpFill',
    category: 'trading',
    supportsFill: false,
    defaultSize: 16,
    keywords: ['up', 'positive', 'gain', 'arrow', 'fill'],
  },
  arrowDownFill: {
    name: 'arrowDownFill',
    category: 'trading',
    supportsFill: false,
    defaultSize: 16,
    keywords: ['down', 'negative', 'loss', 'arrow', 'fill'],
  },
  trading: {
    name: 'trading',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['trade', 'exchange'],
  },
  wallet: {
    name: 'wallet',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['money', 'funds'],
  },
  coins: {
    name: 'coins',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['currency', 'money'],
  },
  deposit: {
    name: 'deposit',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['add', 'fund'],
  },
  creditCard: {
    name: 'creditCard',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['payment', 'card'],
  },
  btc: {
    name: 'btc',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['bitcoin', 'crypto'],
  },
  gainers: {
    name: 'gainers',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['up', 'positive', 'growth'],
  },
  losers: {
    name: 'losers',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['down', 'negative', 'decline'],
  },
  yeild: {
    name: 'yeild',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['return', 'profit'],
  },
  barChart: {
    name: 'barChart',
    category: 'trading',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['chart', 'graph', 'bar', 'statistics'],
  },

  // Actions
  plus: {
    name: 'plus',
    category: 'actions',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['add', 'create', 'new'],
  },
  plusLine: {
    name: 'plusLine',
    category: 'actions',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['add', 'create', 'new', 'plus', 'line'],
  },
  minus: {
    name: 'minus',
    category: 'actions',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['remove', 'subtract'],
  },
  close: {
    name: 'close',
    category: 'actions',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['cancel', 'exit', 'x'],
  },
  closeSmall: {
    name: 'closeSmall',
    category: 'actions',
    supportsFill: false,
    defaultSize: 16,
    keywords: ['cancel', 'exit', 'x'],
  },
  deleteText: {
    name: 'deleteText',
    category: 'actions',
    supportsFill: true,
    defaultSize: 20,
    keywords: ['clear', 'remove', 'cancel', 'x'],
  },
  heart: {
    name: 'heart',
    category: 'actions',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['favorite', 'love', 'like'],
  },
  star: {
    name: 'star',
    category: 'actions',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['star', 'favorite', 'rating'],
  },
  like: {
    name: 'like',
    category: 'actions',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['thumbs', 'approve'],
  },
  share: {
    name: 'share',
    category: 'actions',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['export', 'send'],
  },
  copy: {
    name: 'copy',
    category: 'actions',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['duplicate', 'clipboard', 'paste'],
  },
  comment: {
    name: 'comment',
    category: 'actions',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['message', 'chat'],
  },
  more: {
    name: 'more',
    category: 'actions',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['options', 'menu'],
  },
  moreVertical: {
    name: 'moreVertical',
    category: 'actions',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['options', 'menu'],
  },
  checked: {
    name: 'checked',
    category: 'actions',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['complete', 'done', 'tick'],
  },
  checkCircle: {
    name: 'checkCircle',
    category: 'actions',
    supportsFill: true,
    defaultSize: 16,
    keywords: ['check', 'circle', 'tick', 'done', 'complete', 'selected'],
  },
  checkLine: {
    name: 'checkLine',
    category: 'actions',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['check', 'tick', 'done', 'complete', 'line'],
  },
  triangleUp: {
    name: 'triangleUp',
    category: 'trading',
    supportsFill: true,
    defaultSize: 12,
    keywords: ['up', 'positive', 'gain', 'arrow', 'increase'],
  },
  triangleDown: {
    name: 'triangleDown',
    category: 'trading',
    supportsFill: true,
    defaultSize: 12,
    keywords: ['down', 'negative', 'loss', 'arrow', 'decrease'],
  },
  caretUp: {
    name: 'caretUp',
    category: 'trading',
    supportsFill: false,
    defaultSize: 7,
    keywords: ['up', 'positive', 'gain', 'caret', 'increase'],
  },
  caretDown: {
    name: 'caretDown',
    category: 'trading',
    supportsFill: false,
    defaultSize: 7,
    keywords: ['down', 'negative', 'loss', 'caret', 'decrease'],
  },

  // Brand
  apple: {
    name: 'apple',
    category: 'brand',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['aapl', 'company', 'stock'],
  },
  appleDark: {
    name: 'appleDark',
    category: 'brand',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['aapl', 'company', 'stock'],
  },
  metaDark: {
    name: 'metaDark',
    category: 'brand',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['meta', 'facebook', 'social'],
  },
  google: {
    name: 'google',
    category: 'brand',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['google', 'alphabet'],
  },
  googleDark: {
    name: 'googleDark',
    category: 'brand',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['googl', 'alphabet'],
  },
  etorianClub: {
    name: 'etorianClub',
    category: 'brand',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['etoro', 'club', 'premium'],
  },
  'pro-investor': {
    name: 'pro-investor',
    category: 'brand',
    supportsFill: false,
    defaultSize: 18,
    keywords: ['investor', 'pro', 'trader', 'badge'],
  },
  'popular-investor': {
    name: 'popular-investor',
    category: 'brand',
    supportsFill: false,
    defaultSize: 18,
    keywords: ['investor', 'popular', 'trader', 'badge'],
  },
  torii: {
    name: 'torii',
    category: 'brand',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['etoro', 'logo', 'brand'],
  },

  // UI & Interface
  chat: {
    name: 'chat',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['message', 'conversation'],
  },
  mail: {
    name: 'mail',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['email', 'envelope'],
  },
  notification: {
    name: 'notification',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['alert', 'bell'],
  },
  display: {
    name: 'display',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['screen', 'monitor'],
  },
  eye: {
    name: 'eye',
    category: 'ui',
    supportsFill: false,
    defaultSize: 20,
    keywords: ['view', 'visible', 'show'],
  },
  eyeOff: {
    name: 'eyeOff',
    category: 'ui',
    supportsFill: false,
    defaultSize: 20,
    keywords: ['hide', 'invisible'],
  },
  calendar: {
    name: 'calendar',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['date', 'schedule'],
  },
  academy: {
    name: 'academy',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['education', 'learning'],
  },
  inviteFriends: {
    name: 'inviteFriends',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['share', 'invite'],
  },
  news: {
    name: 'news',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['article', 'information'],
  },
  upcomingEvent: {
    name: 'upcomingEvent',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['event', 'schedule'],
  },
  ai: {
    name: 'ai',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['artificial', 'intelligence'],
  },
  watched: {
    name: 'watched',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['eye', 'viewing'],
  },
  switchUnits: {
    name: 'switchUnits',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['toggle', 'change'],
  },
  trade: {
    name: 'trade',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['trade', 'exchange'],
  },
  priceAlert: {
    name: 'priceAlert',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['alert', 'price'],
  },
  trash: {
    name: 'trash',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['delete', 'remove'],
  },
  loader: {
    name: 'loader',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['loading', 'spinner'],
  },
  expand: {
    name: 'expand',
    category: 'ui',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['expand', 'open'],
  },
  bullishArrow: {
    name: 'bullishArrow',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['arrow', 'up', 'positive'],
  },
  afterHours: {
    name: 'afterHours',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['after', 'hours'],
  },
  bullish: {
    name: 'bullish',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['bullish', 'up', 'positive'],
  },
  v: {
    name: 'v',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['v', 'vertical'],
  },
  arrow: {
    name: 'arrow',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['arrow', 'direction'],
  },
  error: {
    name: 'error',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['error', 'alert'],
  },
  exclamationCircleLine: {
    name: 'exclamationCircleLine',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['exclamation', 'warning', 'info', 'circle', 'alert'],
  },
  infoCircleLine: {
    name: 'infoCircleLine',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['info', 'information', 'circle', 'help', 'tooltip'],
  },
  infoCircleFill: {
    name: 'infoCircleFill',
    category: 'ui',
    supportsFill: true,
    defaultSize: 24,
    keywords: ['info', 'information', 'circle', 'help', 'tooltip', 'fill', 'solid'],
  },
  history: {
    name: 'history',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['history', 'recent', 'clock', 'time', 'past'],
  },
  wifiOff: {
    name: 'wifiOff',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['wifi', 'offline', 'disconnected', 'network', 'no connection'],
  },
  wifiSlow: {
    name: 'wifiSlow',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['wifi', 'slow', 'weak', 'network', 'poor connection'],
  },
  issueReport: {
    name: 'issueReport',
    category: 'ui',
    supportsFill: false,
    defaultSize: 24,
    keywords: ['issue', 'report', 'bug'],
  },
};

/**
 * Get an icon component by name
 * @param iconName The name of the icon
 * @returns The icon component or null if not found
 */
export function getIconComponent(iconName: IconName): ComponentType<IconProps> | null {
  return iconRegistry[iconName] || null;
}

/**
 * Get icon metadata by name
 * @param iconName The name of the icon
 * @returns The icon metadata or null if not found
 */
export function getIconMetadata(iconName: IconName): IconMetadata | null {
  return iconMetadata[iconName] || null;
}

/**
 * Check if an icon supports fill
 * @param iconName The name of the icon
 * @returns Whether the icon supports fill
 */
export function iconSupportsFill(iconName: IconName): boolean {
  const metadata = getIconMetadata(iconName);
  return metadata?.supportsFill || false;
}

/**
 * Get all available icon names
 * @returns Array of all icon names
 */
export function getAllIconNames(): IconName[] {
  return Object.keys(iconRegistry) as IconName[];
}

/**
 * Get icons by category
 * @param category The category to filter by
 * @returns Array of icon names in the category
 */
export function getIconsByCategory(category: string): IconName[] {
  return Object.values(iconMetadata)
    .filter((metadata) => metadata.category === category)
    .map((metadata) => metadata.name);
}

/**
 * Search icons by keyword
 * @param keyword The keyword to search for
 * @returns Array of matching icon names
 */
export function searchIcons(keyword: string): IconName[] {
  const lowerKeyword = keyword.toLowerCase();
  return Object.values(iconMetadata)
    .filter((metadata) => metadata.name.toLowerCase().includes(lowerKeyword) || metadata.keywords.some((k) => k.toLowerCase().includes(lowerKeyword)))
    .map((metadata) => metadata.name);
}
