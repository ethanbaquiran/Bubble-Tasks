import React, { useEffect } from "react";
import { Animated, View } from "react-native";

interface BubblePopProps {
  x: number; // starting X position
  y: number; // starting Y position
  onComplete?: () => void;
}

export default function BubblePop({ x, y, onComplete }: BubblePopProps) {
  const drops = Array.from({ length: 8 }).map(() => ({
    anim: new Animated.Value(0),
    angle: (Math.random() - 0.5) * Math.PI, // random spread
    distance: 60 + Math.random() * 40, // random distance
    size: 6 + Math.random() * 4,
  }));

  useEffect(() => {
    Animated.stagger(
      30,
      drops.map((drop) =>
        Animated.timing(drop.anim, {
          toValue: 1,
          duration: 400 + Math.random() * 200,
          useNativeDriver: true,
        })
      )
    ).start(() => onComplete && onComplete());
  }, []);

  return (
    <View style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {drops.map((drop, i) => {
        const translateX = drop.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [x, x + Math.cos(drop.angle) * drop.distance],
        });
        const translateY = drop.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [y, y + Math.sin(drop.angle) * drop.distance],
        });

        return (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              width: drop.size,
              height: drop.size,
              borderRadius: drop.size / 2,
              backgroundColor: "rgba(173,216,230,0.8)", // light blue drops
              transform: [{ translateX }, { translateY }],
            }}
          />
        );
      })}
    </View>
  );
}
