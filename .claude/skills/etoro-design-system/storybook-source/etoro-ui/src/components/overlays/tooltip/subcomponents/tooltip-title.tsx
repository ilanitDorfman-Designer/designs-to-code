import type { ReactNode } from 'react';

import type { TooltipTitleProps } from '../api/types';

/**
 * EtTooltip.Title - Declarative title slot for the tooltip header
 *
 * Content is extracted by the parent EtTooltip and rendered
 * in the bottom sheet header. Returns children as fallback
 * if rendered directly.
 *
 * @example
 * ```tsx
 * <EtTooltip ref={tooltipRef}>
 *   <EtTooltip.Title>Recently Traded</EtTooltip.Title>
 *   <EtTooltip.Body>Disclaimer text</EtTooltip.Body>
 * </EtTooltip>
 * ```
 */
export function TooltipTitle({ children }: TooltipTitleProps): ReactNode {
  return children;
}

TooltipTitle.displayName = 'EtTooltip.Title';
