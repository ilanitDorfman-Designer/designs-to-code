import { useEffect, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

export type SkiaRuntimeStatus = 'idle' | 'loading' | 'ready' | 'failed' | 'unsupported';

export interface SkiaRuntimeUnsupportedResult {
  status: 'unsupported';
  reason: 'webassembly_unavailable';
}

export type SkiaRuntimeLoaderResult = void | SkiaRuntimeUnsupportedResult;

const WEBASSEMBLY_UNSUPPORTED_RESULT: SkiaRuntimeUnsupportedResult = {
  status: 'unsupported',
  reason: 'webassembly_unavailable',
};

export interface SkiaRuntimeSnapshot {
  status: SkiaRuntimeStatus;
  error: Error | null;
}

interface UseSkiaRuntimeOptions {
  request?: boolean;
}

type SkiaRuntimeLoader = () => Promise<SkiaRuntimeLoaderResult>;

// Native resolves ready immediately through JSI. Web receives its loader from
// app setup so design-system callers can request the capability without owning
// browser paths or CanvasKit configuration.
const IS_WEB = Platform.OS === 'web';

function hasCanvasKit(): boolean {
  return typeof global !== 'undefined' && (global as { CanvasKit?: unknown }).CanvasKit != null;
}

let loader: SkiaRuntimeLoader | null = null;
let inFlight: Promise<SkiaRuntimeLoaderResult> | null = null;
let attempt = 0;
let snapshot: SkiaRuntimeSnapshot = {
  status: !IS_WEB || hasCanvasKit() ? 'ready' : 'idle',
  error: null,
};
const WEB_SERVER_SNAPSHOT: SkiaRuntimeSnapshot = { status: 'idle', error: null };
const NATIVE_SERVER_SNAPSHOT: SkiaRuntimeSnapshot = { status: 'ready', error: null };

const listeners = new Set<() => void>();

function publish(status: SkiaRuntimeStatus, error: Error | null = null): void {
  if (snapshot.status === status && snapshot.error === error) return;
  snapshot = { status, error };
  listeners.forEach((listener) => listener());
}

export function configureSkiaRuntimeLoader(nextLoader: SkiaRuntimeLoader): void {
  if (!IS_WEB) return;
  loader = nextLoader;
}

export function requestSkiaRuntime(): Promise<SkiaRuntimeLoaderResult> {
  if (snapshot.status === 'ready') return Promise.resolve();
  if (snapshot.status === 'unsupported') return Promise.resolve(WEBASSEMBLY_UNSUPPORTED_RESULT);
  if (snapshot.status === 'loading' && inFlight) return inFlight;
  if (!loader) {
    const error = new Error('Skia runtime loader is not configured');
    publish('failed', error);
    return Promise.reject(error);
  }

  const currentAttempt = ++attempt;
  publish('loading');
  const promise = Promise.resolve()
    .then(loader)
    .then(
      (result) => {
        if (currentAttempt !== attempt) return;
        publish(result?.status === 'unsupported' ? 'unsupported' : 'ready');
        return result;
      },
      (caught: unknown) => {
        const error = caught instanceof Error ? caught : new Error(String(caught));
        if (currentAttempt === attempt) publish('failed', error);
        throw error;
      },
    )
    .finally(() => {
      if (inFlight === promise) inFlight = null;
    });
  inFlight = promise;
  return promise;
}

// Intentional semantic alias: requestSkiaRuntime already restarts after a
// failure; the distinct name keeps retry-affordance call sites honest and
// stable if retry semantics ever diverge from first-request semantics.
export function retrySkiaRuntime(): Promise<SkiaRuntimeLoaderResult> {
  return requestSkiaRuntime();
}

export function getSkiaRuntimeSnapshot(): SkiaRuntimeSnapshot {
  return snapshot;
}

export function markSkiaReady(): void {
  attempt += 1;
  inFlight = null;
  publish('ready');
}

function subscribe(onStoreChange: () => void): () => void {
  if (!IS_WEB) return () => undefined; // native value never changes
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

// Must stay side-effect-free (useSyncExternalStore's cached-snapshot contract).
function getSnapshot(): SkiaRuntimeSnapshot {
  return snapshot;
}

function getServerSnapshot(): SkiaRuntimeSnapshot {
  return IS_WEB ? WEB_SERVER_SNAPSHOT : NATIVE_SERVER_SNAPSHOT;
}

export function useSkiaRuntime({ request = true }: UseSkiaRuntimeOptions = {}): SkiaRuntimeSnapshot {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    if (request && state.status === 'idle') {
      void requestSkiaRuntime().catch(() => {
        // Failure is represented by the reactive state and rendered by the
        // owning material surface. Avoid an unhandled rejection here.
      });
    }
  }, [request, state.status]);
  return state;
}

export function useSkiaReady(): boolean {
  return useSkiaRuntime().status === 'ready';
}
