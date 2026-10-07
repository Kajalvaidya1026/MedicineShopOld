import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type EmbossedIconProps = {
  icon: keyof typeof Ionicons.glyphMap;
};

export default function EmbossedIcon({ icon }: EmbossedIconProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Ionicons name={icon} size={29} color="#0D7180" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EAF6F8",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: -6,
      height: -6,
    },
    shadowOpacity: 1,
    shadowRadius: 8,

    elevation: 5,
  },

  inner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#EAF6F8",

    shadowColor: "#9ABFC5",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 4,
  },

});
