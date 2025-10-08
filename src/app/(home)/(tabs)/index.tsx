import { useAuth } from '@/src/providers/AuthProvider';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link, router, Stack } from 'expo-router';
import React from 'react';
import type { Channel } from 'stream-chat';
import { ChannelList } from 'stream-chat-expo';

export default function MainTabScreen() {
    const [channel, setChannel] = React.useState<Channel | null>(null);
    const { user } = useAuth();

    return (
        <>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Link href="/(home)/users" asChild>
                            <FontAwesome5
                                name="users"
                                size={24}
                                color="gray"
                                style={{ marginHorizontal: 15 }}
                            />
                        </Link>
                    ),
                }}
            />
            {user && (
                <ChannelList
                    filters={{ members: { $in: [user.id] } }}
                    onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
                />
            )}
        </>
    );
}
