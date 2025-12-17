import React from "react";
import { CinematicHero } from "@/components/CinematicHero";

interface HomeVideoHeroProps {
  onPress?: () => void;
}

export function HomeVideoHero({ onPress }: HomeVideoHeroProps) {
  return (
    <CinematicHero
      height={380}
      onInteract={onPress}
      gradient={["#0D1B2A", "#1A1A1D", "#0D1B2A"]}
      accentColor="#1E90FF"
    />
  );
}
