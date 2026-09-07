import type { TickerContentProps } from '../api';
import { TickerItem } from './ticker-item';

/**
 * EtTicker.Content - Renders all ticker items with spacing between them.
 * Colors are provided via TickerContext (no props needed).
 */
export function TickerContent({ items }: TickerContentProps) {
  return (
    <>
      {items.map((item) => (
        <TickerItem key={item.instrumentId} item={item} testID={`ticker-item-${item.instrumentId}`} />
      ))}
    </>
  );
}

TickerContent.displayName = 'EtTicker.Content';
