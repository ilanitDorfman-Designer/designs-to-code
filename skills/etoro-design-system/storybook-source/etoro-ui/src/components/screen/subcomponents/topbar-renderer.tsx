import { EtTopbar } from '../../topbar/et-topbar';
import { EtScreenTopBarProps } from '../api/types';
import { DefaultStartButton } from './default-start-button';

interface TopBarRendererProps {
  config: EtScreenTopBarProps;
}

/**
 * Composes an EtTopbar from the screen's TopBar configuration.
 * Maps the config's start/middle/end slots into EtTopbar compound children.
 *
 * Transparent top bars disable Liquid Glass — they blend with the screen background
 * so glass capsules on Start/End buttons are visually wrong.
 */
export function TopBarRenderer({ config }: TopBarRendererProps) {
  const baseStyle = config.transparent ? transparentStyle : undefined;
  return (
    <EtTopbar style={[baseStyle, config.style]} disableLiquidGlass={config.transparent}>
      <EtTopbar.Start>{config.start ?? <DefaultStartButton isInnerScreen={config.isInnerScreen} />}</EtTopbar.Start>
      {config.middle != null ? <EtTopbar.Middle>{config.middle}</EtTopbar.Middle> : null}
      {config.end != null ? <EtTopbar.End>{config.end}</EtTopbar.End> : null}
    </EtTopbar>
  );
}

const transparentStyle = { backgroundColor: 'transparent' } as const;
