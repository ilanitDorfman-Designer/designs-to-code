import { ReactElement } from 'react';

// Import directly from .types.ts files to avoid circular dependencies
// (barrel exports include component files that import context which imports api)
import { EtBottomSheetContentProps } from '../subcomponents/content/et-bottom-sheet-content.types';
import { EtBottomSheetFooterProps } from '../subcomponents/footer/et-bottom-sheet-footer.types';
import { EtBottomSheetHeaderProps } from '../subcomponents/header/et-bottom-sheet-header.types';
import { EtBottomSheetFlashListProps } from '../subcomponents/list/flash/et-bottom-sheet-flash-list.types';
import { EtBottomSheetListProps } from '../subcomponents/list/flat/et-bottom-sheet-list.types';
import { EtBottomSheetSectionListProps } from '../subcomponents/list/section/et-bottom-sheet-section-list.types';

// Re-export library types for better developer experience
export type { BottomSheetBackdropProps, BottomSheetHandleProps, BottomSheetFooterProps as GorhomBottomSheetFooterProps } from '@gorhom/bottom-sheet';

// Re-export BottomSheetModal for ref typing
export type { BottomSheetModal } from '@gorhom/bottom-sheet';

// Re-export subcomponent types (from direct .types.ts files to avoid circular deps)
export type { EtBottomSheetContentProps } from '../subcomponents/content/et-bottom-sheet-content.types';
export type { EtBottomSheetFooterProps } from '../subcomponents/footer/et-bottom-sheet-footer.types';
export type {
  EtBottomSheetHeaderActionProps,
  EtBottomSheetHeaderProps,
  EtBottomSheetHeaderTitleProps,
} from '../subcomponents/header/et-bottom-sheet-header.types';
export type { EtBottomSheetFlashListProps } from '../subcomponents/list/flash/et-bottom-sheet-flash-list.types';
export type { EtBottomSheetListProps } from '../subcomponents/list/flat/et-bottom-sheet-list.types';
export type { EtBottomSheetSectionListProps } from '../subcomponents/list/section/et-bottom-sheet-section-list.types';

// ============================================================================
// Backdrop Configuration
// ============================================================================

export interface BackdropConfig {
  /** Enable backdrop overlay */
  enabled?: boolean;
  /** Custom backdrop press handler (called before dismiss) */
  onPress?: () => void;
  /** Maximum animated opacity for the backdrop container (0-1). Default: 0.85 */
  opacity?: number;
  testID?: string;
}

// ============================================================================
// Children Types
// ============================================================================

/**
 * Valid header child type for EtBottomSheet.
 * Accepts EtBottomSheet.Header.
 */
export type EtBottomSheetHeaderChild = ReactElement<EtBottomSheetHeaderProps>;

/**
 * Valid content child types for EtBottomSheet.
 * Accepts EtBottomSheet.Content, EtBottomSheet.List, EtBottomSheet.SectionList, or EtBottomSheet.FlashList.
 */
export type EtBottomSheetContentChild =
  | ReactElement<EtBottomSheetContentProps>
  | ReactElement<EtBottomSheetListProps<unknown>>
  | ReactElement<EtBottomSheetSectionListProps<unknown, unknown>>
  | ReactElement<EtBottomSheetFlashListProps<unknown>>;

/**
 * Valid footer child type for EtBottomSheet.
 */
export type EtBottomSheetFooterChild = ReactElement<EtBottomSheetFooterProps>;

/**
 * Valid child element for EtBottomSheet compound component.
 */
export type EtBottomSheetChild = EtBottomSheetHeaderChild | EtBottomSheetContentChild | EtBottomSheetFooterChild;

/**
 * Valid children for EtBottomSheet compound component.
 *
 * Only accepts valid EtBottomSheet subcomponents:
 * - EtBottomSheet.Header
 * - EtBottomSheet.Content, EtBottomSheet.List, EtBottomSheet.SectionList, or EtBottomSheet.FlashList
 * - EtBottomSheet.Footer
 *
 * Invalid children will:
 * - Show TypeScript errors at compile time (strict typing)
 * - Be silently ignored at runtime (graceful degradation)
 *
 * Runtime validation in `parseBottomSheetChildren` provides additional safety.
 *
 * @example Valid children
 * ```tsx
 * <EtBottomSheet bottomSheetRef={ref}>
 *   <EtBottomSheet.Header>
 *     <EtBottomSheet.Header.Title>Title</EtBottomSheet.Header.Title>
 *   </EtBottomSheet.Header>
 *   <EtBottomSheet.Content>...</EtBottomSheet.Content>
 *   <EtBottomSheet.Footer>...</EtBottomSheet.Footer>
 * </EtBottomSheet>
 * ```
 */
export type EtBottomSheetChildren = EtBottomSheetChild | EtBottomSheetChild[] | null | undefined;
