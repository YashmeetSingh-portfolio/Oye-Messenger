//This file is the layout for the home directory

import { useAuth } from "@/src/providers/AuthProvider";
import CallProvider from "@/src/providers/CallProvider";
import ChatProvider from "@/src/providers/ChatProvider";
import VideoProvider from "@/src/providers/VideoProvider";
import { Redirect, Stack } from "expo-router";
import React from "react";
export default function HomeLayout() {
    const {user} = useAuth();
    
    if(!user){
        return <Redirect href="/(auth)/login" />;
    }
   
    return (
        
                <ChatProvider>
                    <VideoProvider>
                        <CallProvider>

                    <Stack >
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="channel" options={{ headerShown: false }} />
                    </Stack>
                        </CallProvider>
                    </VideoProvider>
                </ChatProvider>

            
    );
}