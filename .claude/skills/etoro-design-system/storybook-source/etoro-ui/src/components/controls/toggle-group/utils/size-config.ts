import type { ToggleGroupSize } from '../api';

export interface ToggleGroupSizeConfiguration {
  height: number;
  optionSize: number;
  padding: number;
}

export const TOGGLE_GROUP_SIZE_CONFIGS: Record<ToggleGroupSize, ToggleGroupSizeConfiguration> = {
  small: {
    height: 32,
    optionSize: 24,
    padding: 4,
  },
  default: {
    height: 40,
    optionSize: 32,
    padding: 4,
  },
};

export function getToggleGroupSizeConfig(size: ToggleGroupSize): ToggleGroupSizeConfiguration {
  return TOGGLE_GROUP_SIZE_CONFIGS[size];
}
