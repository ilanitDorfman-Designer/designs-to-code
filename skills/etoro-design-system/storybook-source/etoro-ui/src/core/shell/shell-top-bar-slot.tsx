import { createContext, ReactNode, useContext, useEffect, useId, useRef, useSyncExternalStore } from 'react';

/**
 * What a screen hands up: the same three slots `EtScreen.TopBar` already has, so
 * a screen declares its bar exactly as it does on native and the frame decides
 * where each part goes.
 */
export interface ShellTopBarSlotContent {
  /** Leading control — a back chevron on an inner screen. */
  start: ReactNode;
  /** The screen title. */
  middle: ReactNode;
  /** Screen actions. */
  end: ReactNode;
}

interface ShellTopBarEntry {
  id: string;
  content: ShellTopBarSlotContent | null;
}

/**
 * The published top-bar content, held OUTSIDE React state on purpose.
 *
 * If the provider re-rendered on every publish it would re-render the navigator
 * underneath it, the screen would produce fresh top-bar JSX, that fresh JSX
 * would publish again — a render loop. Keeping the entries in a store means a
 * publish notifies only the panel that reads it.
 */
class ShellTopBarStore {
  private entries: ShellTopBarEntry[] = [];
  private listeners = new Set<() => void>();
  private snapshot: ShellTopBarSlotContent | null = null;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** Stable between notifications, as `useSyncExternalStore` requires. */
  getSnapshot = (): ShellTopBarSlotContent | null => this.snapshot;

  /**
   * Replaces an existing claim IN PLACE, and appends only on the first claim.
   *
   * The publish effect re-runs on every render of the claiming screen, because its content is fresh
   * JSX each time. Moving a re-claiming entry to the tail would therefore make the order "who
   * rendered last" rather than "who mounted last" — and in a trading app a covered screen re-renders
   * on every price tick, so it would steal the visible screen's slot.
   */
  claim = (id: string, content: ShellTopBarSlotContent | null): void => {
    const index = this.entries.findIndex((entry) => entry.id === id);
    if (index === -1) {
      this.entries = [...this.entries, { id, content }];
    } else {
      if (this.entries[index].content === content) return;
      this.entries = this.entries.map((entry, at) => (at === index ? { id, content } : entry));
    }
    this.commit();
  };

  release = (id: string): void => {
    const next = this.entries.filter((entry) => entry.id !== id);
    if (next.length === this.entries.length) return;
    this.entries = next;
    this.commit();
  };

  /** The most recently claimed slot wins — see {@link ShellTopBarSlotProvider}. */
  private commit(): void {
    const next = this.entries.length > 0 ? this.entries[this.entries.length - 1].content : null;
    if (next === this.snapshot) return;
    this.snapshot = next;
    this.listeners.forEach((listener) => listener());
  }
}

const EMPTY_STORE = new ShellTopBarStore();

const ShellTopBarStoreContext = createContext<ShellTopBarStore | null>(null);

/**
 * Whether the scene this subtree renders in is the one the user is looking at.
 *
 * Defaults to `true`: an ordinary screen is on screen. Only the web tab scene
 * provides `false`, because tab scenes stay mounted when you switch tabs
 * (`detachInactiveScreens={false}`) — without this, four mounted tabs would all
 * claim the frame's action slot at once.
 */
const ShellSceneFocusContext = createContext(true);

export interface ShellSceneFocusProviderProps {
  focused: boolean;
  children: ReactNode;
}

export function ShellSceneFocusProvider({ focused, children }: ShellSceneFocusProviderProps) {
  return <ShellSceneFocusContext.Provider value={focused}>{children}</ShellSceneFocusContext.Provider>;
}

export interface ShellTopBarSlotProviderProps {
  children: ReactNode;
}

/**
 * Holds the top-bar content screens hand up to the app frame.
 *
 * Mounted by the web frame around both the claimants (the navigator) and the
 * reader (the top panel). Exactly one screen owns the slot: the visible one.
 *
 * Two things enforce that. Claims are refereed by scene focus, so a screen that
 * is mounted but covered — an inactive tab, a screen underneath a pushed one —
 * cannot claim at all. Among the rest the most recently MOUNTED claim wins, and
 * a re-claim replaces in place rather than jumping the queue, so a screen that
 * merely re-renders never takes the slot from the screen above it.
 *
 * A framed screen claims even when it has nothing to show, so an empty screen on
 * top clears whatever the screen beneath it was showing instead of inheriting it.
 */
export function ShellTopBarSlotProvider({ children }: ShellTopBarSlotProviderProps) {
  const storeRef = useRef<ShellTopBarStore>(null);
  storeRef.current ??= new ShellTopBarStore();

  return <ShellTopBarStoreContext.Provider value={storeRef.current}>{children}</ShellTopBarStoreContext.Provider>;
}

/**
 * Hands `content` up to the app frame's top panel for as long as this component
 * is mounted in the scene the user is looking at.
 *
 * A no-op with no frame around it — every native render — so a screen can call
 * it unconditionally without knowing the frame exists. Under a frame it claims
 * the slot even when `content` is `null`: that is what stops a screen with
 * nothing to show from inheriting the actions of the screen beneath it.
 */
export function useShellTopBarSlot(content: ShellTopBarSlotContent | null): void {
  const store = useContext(ShellTopBarStoreContext);
  const focused = useContext(ShellSceneFocusContext);
  const id = useId();

  // Two effects, not one. React runs an effect's cleanup before re-running it, so a single effect
  // would release the entry and then re-claim it on every content change — always landing at the
  // tail, which is the very thing `claim` replaces in place to avoid. Publishing has no cleanup;
  // releasing is keyed on the lifetime instead, so it happens only on unmount or on losing focus.
  useEffect(() => {
    if (!store || !focused) return;
    store.claim(id, content);
  }, [content, focused, id, store]);

  useEffect(() => {
    if (!store || !focused) return undefined;
    return () => store.release(id);
  }, [focused, id, store]);
}

/** What the screen on top handed up, for the frame to place. */
export function useShellTopBarContent(): ShellTopBarSlotContent | null {
  const store = useContext(ShellTopBarStoreContext) ?? EMPTY_STORE;
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
