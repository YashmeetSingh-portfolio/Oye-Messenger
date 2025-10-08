import React, { PropsWithChildren, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";

export default function ChatProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = React.useState(false);
    const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);
    const { profile } = useAuth();

    useEffect(() => {
        if (!profile) { return; }

        const connect = async () => {
            await client.connectUser(
                {
                    id: profile?.id!,
                    name: profile.full_name,
                    image: profile?.avatar_url
                        ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl
                        : 'https://your-app.com/default-avatar.png',
                },
                client.devToken(profile?.id!),
            );
            setIsReady(true);
            // const channel = client.channel("messaging", "the_park", {
            //     name: "The Park",
            // });
            // await channel.watch();
        };
        connect();

        return () => {
            if (isReady)
                client.disconnectUser();
            setIsReady(false);
        };
    }, [profile?.id]);

    useEffect(() => { });

    if (!isReady) {
        return <ActivityIndicator />;
    }

    return (
        <OverlayProvider>
            <Chat client={client}>
                {children}
            </Chat>
        </OverlayProvider>
    );
}
