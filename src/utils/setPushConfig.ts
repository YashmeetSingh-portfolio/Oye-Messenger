import { AndroidImportance } from "@notifee/react-native";
import {
  StreamVideoClient,
  StreamVideoRN,
} from "@stream-io/video-react-native-sdk";
import { supabase } from "../lib/supabase";
import { tokenProvider } from "./tokenProvider"; // you already have this

export async function setPushConfig() {
  console.log("Set push");

  StreamVideoRN.setPushConfig({
    // pass true to inform the SDK that this is an expo app
    isExpo: true,

    ios: {
      // add your push_provider_name for iOS that you have setup in Stream dashboard
      pushProviderName: "APN",
    },

    android: {
      // add your push_provider_name for Android that you have setup in Stream dashboard
      pushProviderName: "Firebase",
      incomingCallChannel: {
        id: "stream_incoming_call",
        name: "Incoming call notifications",
        importance: AndroidImportance.HIGH,
      },
      incomingCallNotificationTextGetters: {
        getTitle: (createdUserName: string) =>
          `Incoming call from ${createdUserName}`,
        getBody: () => "Tap to answer the call",
      },
    },

    // dynamically create Stream Video client for push calls
    createStreamVideoClient: async () => {
      try {
        // ✅ Get current session from Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          console.warn("No active user session found for StreamVideoClient.");
          throw new Error("User not logged in");
        }
        console.log("Creating StreamVideoClient for user:", session.user.id);
        console.log('tokenProvider:', tokenProvider);
        const user = {
          id: session.user.id,
          name: session.user.user_metadata?.name || "Unknown User",
        };

        // ✅ Use your existing token provider instead of a hardcoded token
        return StreamVideoClient.getOrCreateInstance({
          apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY ?? "",
          user,
          tokenProvider, // <-- automatically fetches token per user
        });
      } catch (err) {
        console.error("Failed to create StreamVideoClient:", err);
        throw err;
      }
    },
  });
}
