import { Text, type TextProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Typography } from "@/constants/theme";
import { useResponsiveFontSize, ResponsiveFontRanges } from "@/hooks/useResponsiveFontSize";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "display" | "h1" | "h2" | "h3" | "h4" | "body" | "bodyLarge" | "small" | "caption" | "link" | "price";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "body",
  numberOfLines = 1,
  ...rest
}: ThemedTextProps) {
  const { theme, isDark } = useTheme();

  const getColor = () => {
    if (isDark && darkColor) {
      return darkColor;
    }

    if (!isDark && lightColor) {
      return lightColor;
    }

    if (type === "link") {
      return theme.link;
    }

    return theme.text;
  };

  // Use responsive font sizing with no wrapping
  const responsiveFontSize = useResponsiveFontSize(ResponsiveFontRanges[type]);

  const getTypeStyle = () => {
    const baseStyle = (() => {
      switch (type) {
        case "display":
          return Typography.display;
        case "h1":
          return Typography.h1;
        case "h2":
          return Typography.h2;
        case "h3":
          return Typography.h3;
        case "h4":
          return Typography.h4;
        case "body":
          return Typography.body;
        case "bodyLarge":
          return Typography.bodyLarge;
        case "small":
          return Typography.small;
        case "caption":
          return Typography.caption;
        case "link":
          return Typography.link;
        case "price":
          return Typography.price;
        default:
          return Typography.body;
      }
    })();

    return {
      ...baseStyle,
      fontSize: responsiveFontSize,
    };
  };

  return (
    <Text 
      numberOfLines={numberOfLines} 
      style={[{ color: getColor() }, getTypeStyle(), style]} 
      {...rest} 
    />
  );
}
