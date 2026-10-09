import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AnimatedCardProps = {
  title: string;
  description?: string;
  onPress?: () => void;
};

export default function AnimatedCard({
  title,
  description,
  onPress,
}: AnimatedCardProps) {
  const [scale] = useState(() => new Animated.Value(0.8));
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.card}
      >
        <View>
          <Text style={styles.title}>{title}</Text>

          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },

  card: {
    minHeight: 120,
    padding: 22,
    borderRadius: 24,

    backgroundColor: "#f4f7fb",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 15,

    elevation: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
  },
});