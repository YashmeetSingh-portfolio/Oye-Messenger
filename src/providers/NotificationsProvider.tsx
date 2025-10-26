import messaging from "@react-native-firebase/messaging";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { tokenProvider } from "../utils/tokenProvider";
import { useAuth } from "./AuthProvider";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
      if (user?.id) {
        await client.addDevice(newToken, "firebase", user.id, "Firebase");
        console.log("🔁 Refreshed FCM token registered with Stream Chat");
      }
    });
    return unsubscribe;
  }, [user?.id]);



  useEffect(() => {
    const setupPush = async () => {
      if (!user?.id) {
        console.warn("User not authenticated yet; skipping push setup.");
        return;
      }

      try {
        // 🔹 Ask for permission if not granted
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!enabled) {
          console.warn("Push permission not granted");
          return;
        }

        // 🔹 Authenticate StreamChat client
        if (!client.user || client.user.id !== user.id) {
          await client.connectUser(
            {
              id: user.id,
              name: user.user_metadata?.name ?? "Unknown User",
            },
            tokenProvider
          );
        }


        // 🔹 Register Firebase token
        const token = await messaging().getToken();
        const push_provider = "firebase";
        const push_provider_name = "Firebase";

        // Clean up any old devices (optional but cleaner)
        const existingDevices = await client.getDevices();
        for (const device of existingDevices?.devices ?? []) {
          if (device.push_provider === push_provider) {
            await client.removeDevice(device.id);
          }
        }

        await client.addDevice(token, push_provider, user.id, push_provider_name);
        console.log("✅ FCM token registered with Stream Chat:", token);
        setIsReady(true);
      } catch (err) {
        console.error("Error setting up Stream push:", err);
      }
    };

    setupPush();

    // Clean disconnect on unmount
    return () => {
      if (client.userID) {
        client.disconnectUser();
      }
    };
  }, [user?.id]);

  if (!isReady) return null;
  return <>{children}</>;
}
