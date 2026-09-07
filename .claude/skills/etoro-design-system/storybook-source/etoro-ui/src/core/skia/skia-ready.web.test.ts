function loadWebSubject() {
  jest.resetModules();
  jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }));
  return require('./skia-ready') as typeof import('./skia-ready');
}

describe('web Skia runtime capability', () => {
  afterEach(() => {
    jest.dontMock('react-native');
  });

  it('starts idle and shares one in-flight request', async () => {
    const subject = loadWebSubject();
    let resolveLoad!: () => void;
    const loader = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveLoad = resolve;
        }),
    );
    subject.configureSkiaRuntimeLoader(loader);

    const first = subject.requestSkiaRuntime();
    const second = subject.requestSkiaRuntime();
    expect(first).toBe(second);
    expect(subject.getSkiaRuntimeSnapshot()).toEqual({ status: 'loading', error: null });
    await Promise.resolve();
    expect(loader).toHaveBeenCalledTimes(1);

    resolveLoad();
    await first;
    expect(subject.getSkiaRuntimeSnapshot()).toEqual({ status: 'ready', error: null });
  });

  it('publishes failure and retries with a fresh loader attempt', async () => {
    const subject = loadWebSubject();
    const failure = new Error('wasm unavailable');
    const loader = jest.fn().mockRejectedValueOnce(failure).mockResolvedValueOnce(undefined);
    subject.configureSkiaRuntimeLoader(loader);

    await expect(subject.requestSkiaRuntime()).rejects.toBe(failure);
    expect(subject.getSkiaRuntimeSnapshot()).toEqual({ status: 'failed', error: failure });
    await expect(subject.retrySkiaRuntime()).resolves.toBeUndefined();
    expect(loader).toHaveBeenCalledTimes(2);
    expect(subject.getSkiaRuntimeSnapshot()).toEqual({ status: 'ready', error: null });
  });

  it('publishes a terminal unsupported state without repeating the loader', async () => {
    const subject = loadWebSubject();
    const loader = jest.fn().mockResolvedValue({ status: 'unsupported', reason: 'webassembly_unavailable' } as const);
    subject.configureSkiaRuntimeLoader(loader);

    await expect(subject.requestSkiaRuntime()).resolves.toEqual({ status: 'unsupported', reason: 'webassembly_unavailable' });
    expect(subject.getSkiaRuntimeSnapshot()).toEqual({ status: 'unsupported', error: null });
    await expect(subject.retrySkiaRuntime()).resolves.toEqual({ status: 'unsupported', reason: 'webassembly_unavailable' });
    expect(loader).toHaveBeenCalledTimes(1);
    expect(subject.getSkiaRuntimeSnapshot()).toEqual({ status: 'unsupported', error: null });
  });

  it('does not let a stale rejection overwrite an externally-ready runtime', async () => {
    const subject = loadWebSubject();
    let rejectLoad!: (error: Error) => void;
    subject.configureSkiaRuntimeLoader(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectLoad = reject;
        }),
    );

    const request = subject.requestSkiaRuntime();
    await Promise.resolve();
    subject.markSkiaReady();
    rejectLoad(new Error('late failure'));
    await expect(request).rejects.toThrow('late failure');
    expect(subject.getSkiaRuntimeSnapshot()).toEqual({ status: 'ready', error: null });
  });
});
