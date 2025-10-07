import { router } from 'expo-router';
import React from 'react';
import { ChannelList } from 'stream-chat-expo';


export default function MainTabScreen() {
    
    const [channel, setChannel] = React.useState();
    
    return (
      
        <ChannelList onSelect={(channel) => router.push(`/channel/${channel.cid}`)}  />
    );

}