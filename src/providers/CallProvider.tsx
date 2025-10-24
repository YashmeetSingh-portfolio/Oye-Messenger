import { useCalls } from "@stream-io/video-react-native-sdk";
import { router, useSegments } from "expo-router";
import React, { PropsWithChildren, useEffect } from "react";
import { Pressable, Text } from "react-native";

export default function CallProvider({children}: PropsWithChildren){
    const calls = useCalls();
    const call = calls[0];
    const segments = useSegments();
    const isOnCallScreen = segments[1] === 'call';


     useEffect(() => {
        if(!call){
            return;

        } 
        if(!isOnCallScreen && call.state.callingState === 'ringing'){
        router.push(`/call/${call.id}`);}
        
    }, [call,isOnCallScreen]);


    return(
        <>

        {children}

        {call && !isOnCallScreen && (
         <Pressable 
         style={{position:'absolute', top:100, right:20, zIndex:1000, backgroundColor:'green'}}
            onPress={() => router.push(`/call/${call.id}`)}
         >
         <Text>Active Call: {call?.id}</Text>
        

        </Pressable>
        
 )}       </>
    )
}