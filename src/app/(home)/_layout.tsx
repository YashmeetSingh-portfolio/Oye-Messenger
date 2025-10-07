//This file is the layout for the home directory

import ChatProvider from "@/src/providers/ChatProvider";
import { Stack } from "expo-router";
import React from "react";




export default function HomeLayout() {
   
    return (
        
                <ChatProvider>

                    <Stack >
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                </ChatProvider>

            
    );
}