import { EtoroIcon } from '../../../../foundations/icon-assets';

/**
 * EtTicker.FilterIcon - Filter/sort icon for Start/End slots.
 * Uses the registered `sortDescending` icon from the design system.
 */
export function TickerFilterIcon() {
  return <EtoroIcon icon={{ iconName: 'sortDescending' }} appearance={{ size: 18 }} />;
}

TickerFilterIcon.displayName = 'EtTicker.FilterIcon';
