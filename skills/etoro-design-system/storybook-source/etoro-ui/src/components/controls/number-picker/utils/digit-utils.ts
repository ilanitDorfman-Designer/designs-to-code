// Break down number into individual digits for sliding animation
export const getDigitsFromValue = (value: number): number[] => {
  const numString = Math.abs(Math.floor(value)).toString();
  return numString.split('').map(Number);
};

// Calculate required width based on number of digits
export const calculateRequiredWidth = (digitCount: number, digitWidth: number): number => {
  const totalDigitsWidth = digitWidth * digitCount;
  const padding = 20; // Some padding for breathing room
  return totalDigitsWidth + padding;
};

// Calculate digit width based on font size
export const getDigitWidth = (fontSize: number): number => {
  return fontSize * 0.8;
};
