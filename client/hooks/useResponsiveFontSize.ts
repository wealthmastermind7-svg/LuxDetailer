import { useWindowDimensions } from "react-native";

interface FontRange {
  minSize: number;
  maxSize: number;
  minWidth?: number;
  maxWidth?: number;
}

/**
 * Responsive font sizing that scales with screen size
 * Prevents text wrapping by dynamically adjusting based on available width
 */
export function useResponsiveFontSize(range: FontRange): number {
  const { width } = useWindowDimensions();

  const { minSize, maxSize, minWidth = 320, maxWidth = 600 } = range;

  // Clamp width between min and max
  const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));

  // Linear interpolation between min and max font size
  const scale = (clampedWidth - minWidth) / (maxWidth - minWidth);
  const fontSize = minSize + (maxSize - minSize) * scale;

  return Math.round(fontSize);
}

// Preset responsive font ranges
export const ResponsiveFontRanges = {
  display: { minSize: 40, maxSize: 64, minWidth: 320, maxWidth: 600 },
  h1: { minSize: 32, maxSize: 48, minWidth: 320, maxWidth: 600 },
  h2: { minSize: 26, maxSize: 36, minWidth: 320, maxWidth: 600 },
  h3: { minSize: 22, maxSize: 28, minWidth: 320, maxWidth: 600 },
  h4: { minSize: 18, maxSize: 22, minWidth: 320, maxWidth: 600 },
  bodyLarge: { minSize: 16, maxSize: 20, minWidth: 320, maxWidth: 600 },
  body: { minSize: 15, maxSize: 17, minWidth: 320, maxWidth: 600 },
  small: { minSize: 12, maxSize: 14, minWidth: 320, maxWidth: 600 },
  caption: { minSize: 10, maxSize: 12, minWidth: 320, maxWidth: 600 },
  link: { minSize: 15, maxSize: 17, minWidth: 320, maxWidth: 600 },
  price: { minSize: 24, maxSize: 32, minWidth: 320, maxWidth: 600 },
};
