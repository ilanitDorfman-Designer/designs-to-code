function loadNativeSubject() {
  jest.resetModules();
  jest.doMock('react-native', () => ({ Platform: { OS: 'ios' } }));
  return require('./skia-ready') as typeof import('./skia-ready');
}

describe('native Skia runtime capability', () => {
  afterEach(() => {
    jest.dontMock('react-native');
  });

  it('stays immediately ready and never invokes the web loader', async () => {
    const subject = loadNativeSubject();
    const loader = jest.fn();
    subject.configureSkiaRuntimeLoader(loader);

    expect(subject.getSkiaRuntimeSnapshot()).toEqual({ status: 'ready', error: null });
    await expect(subject.requestSkiaRuntime()).resolves.toBeUndefined();
    expect(loader).not.toHaveBeenCalled();
  });
});
