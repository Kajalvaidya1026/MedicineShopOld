import { StyleSheet, Text, View } from "react-native";

type EmbossedIconProps = {
  icon: string;
};

export default function EmbossedIcon({ icon }: EmbossedIconProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#F1F3F6",
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
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F1F3F6",

    shadowColor: "#BFC3CA",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.45,
    shadowRadius: 7,
    elevation: 4,
  },

  icon: {
    fontSize: 30,
  },
});
