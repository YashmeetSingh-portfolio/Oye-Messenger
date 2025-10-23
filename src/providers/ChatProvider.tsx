import React, { PropsWithChildren, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { supabase } from "../lib/supabase";
import { tokenProvider } from "../utils/tokenProvider";
import { useAuth } from "./AuthProvider";

export default function ChatProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = React.useState(false);
    const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);
    const { profile } = useAuth();

    useEffect(() => {
        if (!profile) return;

        let isMounted = true;

        const connect = async () => {
            
            try {
                if (client.userID && client.userID !== profile.id) {
                    console.log("Disconnecting previous user...");
                    await client.disconnectUser();
                }

                if (client.userID === profile.id) {
                    console.log("Already connected as this user");
                    setIsReady(true);
                    return;
                }

                const token = await tokenProvider();
                console.log("Token:", token);

                await client.connectUser(
                    {
                        id: profile.id,
                        name: profile.full_name,
                        image: profile?.avatar_url
                            ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl
                            : "https://your-app.com/default-avatar.png",
                    },
                    token
                );

                if (isMounted) setIsReady(true);
            } catch (err) {
                console.error("Error connecting user:", err);
            }
        };

        connect();

        return () => {
            isMounted = false;
            if (client.userID) {
                client.disconnectUser().catch(console.error);
            }
            setIsReady(false);
        };
    }, [profile?.id]);


    useEffect(() => { });

    if (!isReady) {
        return <ActivityIndicator />;
    }

    return (
        <OverlayProvider
            value={{
                style: {
                   
                    channelPreview: {
                        container: {
                            backgroundColor: 'white', // ✅ white preview
                            borderBottomWidth: 0, // ✅ remove divider
                        },
                    },
                },
            }}
        >
            <Chat client={client}>
                
                {children}
            </Chat>
        </OverlayProvider>
    );
}
