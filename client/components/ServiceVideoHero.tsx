import React from "react";
import { CinematicHero } from "@/components/CinematicHero";

interface ServiceVideoHeroProps {
  videoPath?: string | null;
  height?: number;
}

/**
 * Service-specific cinematic hero with parallax and interactive moments
 * Replaces video-based approach with handcrafted animated experience
 */
export function ServiceVideoHero({
  videoPath,
  height = 280,
}: ServiceVideoHeroProps) {
  return (
    <CinematicHero
      height={height}
      gradient={["#0A0E27", "#1A1A2E", "#0A0E27"]}
      accentColor="#1E90FF"
    />
  );
}
