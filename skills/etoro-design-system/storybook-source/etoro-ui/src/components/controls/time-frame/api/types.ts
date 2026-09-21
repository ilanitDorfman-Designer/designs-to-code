import { TimeFrame } from '@etoro/common/types';

import { eToroTheme } from '../../../../core/styles';

export interface TimeFrameSelectorProps {
  timeFrames: TimeFrame[];
  selectedTimeFrame: TimeFrame;
  onTimeFrameChange: (_value: TimeFrame) => void;
  fontSize?: number;
}

export interface TimeFrameButtonProps {
  frame: TimeFrame;
  isSelected: boolean;
  onPress: () => void;
  fontSize: number;
  colors: eToroTheme['colors'];
  withHaptics?: boolean;
}
