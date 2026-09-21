// Enhanced spring configuration for digit animations
export const digitSpringConfig = {
  damping: 20,
  stiffness: 150,
  mass: 1.2,
};

// Button press animation configs
export const buttonPressInConfig = {
  damping: 15,
  stiffness: 400,
};

export const buttonPressOutConfig = {
  damping: 15,
  stiffness: 300,
};

// Container width animation config
export const containerWidthConfig = {
  damping: 25,
  stiffness: 180,
  mass: 1.2,
};

// Stagger delay calculation for digit animations
export const calculateStaggerDelay = (columnIndex: number, totalColumns: number): number => {
  return (totalColumns - 1 - columnIndex) * 30;
};
