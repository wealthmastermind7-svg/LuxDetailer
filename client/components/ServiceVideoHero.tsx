import React from "react";
import { CarDetailingCinematic } from "@/components/CarDetailingCinematic";

interface ServiceVideoHeroProps {
  videoPath?: string | null;
  height?: number;
}

/**
 * Service-specific car detailing cinematic with parallax and interactive moments
 * Showcases detailing process through animations and visual effects
 */
export function ServiceVideoHero({
  videoPath,
  height = 280,
}: ServiceVideoHeroProps) {
  return <CarDetailingCinematic height={height} />;
}
