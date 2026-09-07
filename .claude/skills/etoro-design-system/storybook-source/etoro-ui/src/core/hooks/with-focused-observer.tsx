import { useIsFocused, useTheme } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { FunctionComponent } from 'react';
import { Freeze } from 'react-freeze';

/**
 * HOC that wraps a MobX observer component and freezes it when the screen is unfocused.
 * This prevents unnecessary re-renders from MobX observable changes when the screen is not visible.
 *
 * When the screen loses focus, the component is frozen using react-freeze, which suspends
 * all React updates to the subtree while preserving its state.
 * When focus returns, the component resumes normal rendering.
 *
 * Unlike component switching approaches, react-freeze preserves component state and does not
 * cause unmount/remount cycles on focus transitions.
 *
 * @param Component - The functional component to wrap
 * @param displayName - Optional custom display name for debugging
 * @returns A new component that observes MobX only when focused
 *
 * @example
 * const MyScreen = withFocusedObserver(({ store }) => (
 *   <View>
 *     <Text>{store.someValue}</Text>
 *   </View>
 * ));
 */
export function withFocusedObserver<P extends object>(Component: FunctionComponent<P>, displayName?: string): FunctionComponent<P> {
  const ObservedComponent = observer(Component);

  function WrappedComponent(props: P) {
    const isFocused = useIsFocused();
    const { dark } = useTheme();

    return (
      <Freeze key={dark ? 'dark' : 'light'} freeze={!isFocused}>
        <ObservedComponent {...props} />
      </Freeze>
    );
  }

  WrappedComponent.displayName = displayName || `withFocusedObserver(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
