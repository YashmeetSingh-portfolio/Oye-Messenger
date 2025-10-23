import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-native-sdk";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../lib/supabase";
import { tokenProvider } from "../utils/tokenProvider";
import { useAuth } from "./AuthProvider";

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;

export default function VideoProvider({ children }: PropsWithChildren) {
   const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
   const {profile} = useAuth();
   
   useEffect(() => {
    if(!profile) return;
     
     const initVideoClient = async () => {
        const user = {
         id: profile.id,
                                name: profile.full_name,
                                image: profile?.avatar_url
                                    ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl
                                    : "https://your-app.com/default-avatar.png",
     };
     const client = new StreamVideoClient({ apiKey, user, tokenProvider }); 
     setVideoClient(client);
    };
    initVideoClient();
    return() => {
      if(videoClient) {
        videoClient.disconnectUser();
      }
    }
   }, [profile?.id]);

   if(!videoClient) {
    return (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator /></View>);
   }
    return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
}