import { useLoaderContext } from '../api/context';

export function useLoader() {
  const { showLoader, hideLoader, isVisible } = useLoaderContext();

  return { showLoader, hideLoader, isLoading: isVisible };
}
