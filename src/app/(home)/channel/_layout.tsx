import { Stack } from "expo-router";
import React from "react";
export default function ChannelStack() {
    return <Stack>
        <Stack.Screen name ="[cid]" options={{headerShown: false}} />

    </Stack>;
}   