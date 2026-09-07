import { EtSelectLeadingContentProps } from '../api/types';

/**
 * EtSelect.LeadingContent - Renders content before the value text.
 * Works in both text and field types. Used for icons, flags, or any leading content.
 */
export function SelectLeadingContent({ children }: EtSelectLeadingContentProps) {
  return <>{children}</>;
}

SelectLeadingContent.displayName = 'EtSelect.LeadingContent';
