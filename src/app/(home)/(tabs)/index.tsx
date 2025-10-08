import { useAuth } from '@/src/providers/AuthProvider';
import { router } from 'expo-router';
import React from 'react';
import { ChannelList } from 'stream-chat-expo';


export default function MainTabScreen() {
    
    const [channel, setChannel] = React.useState();
    const {user} = useAuth();
    return (
      
        <ChannelList
        filters={{members: {$in: [user.id]}}}
        onSelect={(channel) => router.push(`/channel/${channel.cid}`)}  />
    );

}