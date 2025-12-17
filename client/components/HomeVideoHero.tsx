import React from "react";
import { CarDetailingCinematic } from "@/components/CarDetailingCinematic";

interface HomeVideoHeroProps {
  onPress?: () => void;
}

export function HomeVideoHero({ onPress }: HomeVideoHeroProps) {
  return <CarDetailingCinematic height={380} onInteract={onPress} />;
}
