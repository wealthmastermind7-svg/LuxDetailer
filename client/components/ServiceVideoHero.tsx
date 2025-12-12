import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";
import { CinematicVideoFallback } from "./CinematicVideoFallback";

interface ServiceVideoHeroProps {
  videoPath: string | null | undefined;
  height?: number;
}

/**
 * Service-specific video hero with fallback to cinematic animation
 * Implements observer-based looping for TestFlight reliability
 */
export function ServiceVideoHero({
  videoPath,
  height = 280,
}: ServiceVideoHeroProps) {
  const [videoFailed, setVideoFailed] = useState(false);

  const videoUrl = videoPath
    ? (() => {
        try {
          const baseUrl = getApiUrl();
          return new URL(videoPath, baseUrl).href;
        } catch {
          return videoPath;
        }
      })()
    : null;

  const player = useVideoPlayer(videoUrl || "", (player) => {
    player.muted = true;
    player.loop = true;
  });

  useEffect(() => {
    if (!player || !videoUrl) return;
    const timer = setTimeout(() => {
      try {
        player.play();
      } catch (e) {
        setVideoFailed(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [player, videoUrl]);

  // Fallback to cinematic animation
  if (!videoUrl || videoFailed) {
    return <CinematicVideoFallback height={height} />;
  }

  return (
    <View style={[styles.container, { height }]}>
      {Platform.OS === "web" ? (
        <video
          src={videoUrl}
          style={styles.videoWeb as any}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <VideoView
          style={styles.videoNative}
          player={player}
          nativeControls={false}
          contentFit="cover"
          pointerEvents="none"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  videoNative: {
    width: "100%",
    height: "100%",
  },
  videoWeb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
