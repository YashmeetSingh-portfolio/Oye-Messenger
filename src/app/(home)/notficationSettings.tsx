import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useNotifications } from "../../providers/NotificationsProvider";

export default function NotificationSettings() {
  const { notificationsEnabled, setNotificationsEnabled } = useNotifications();

  const toggleSwitch = async (value: boolean) => {
    await setNotificationsEnabled(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleSwitch} />
      </View>
      <Text style={styles.desc}>
        {notificationsEnabled
          ? "You’ll receive message and activity notifications."
          : "Push notifications are turned off. You can turn them back on anytime."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  desc: {
    fontSize: 14,
    color: "#555",
  },
});
