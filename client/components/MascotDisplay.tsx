import React from "react";
import { useMascot } from "@/contexts/MascotContext";
import { FloatingMascot } from "@/components/FloatingMascot";

interface MascotDisplayProps {
  bottomOffset?: number;
}

export function MascotDisplay({ bottomOffset = 100 }: MascotDisplayProps) {
  const { message } = useMascot();
  
  return <FloatingMascot message={message ?? undefined} bottomOffset={bottomOffset} />;
}
