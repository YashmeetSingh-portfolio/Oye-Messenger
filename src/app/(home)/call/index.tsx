import {
    CallContent,
    StreamCall,
    useStreamVideoClient
} from "@stream-io/video-react-native-sdk";
import React from "react";



const callId = "default_7c8989c1-85dc-4f50-ad51-d89443084d53";




export default function CallScreen() {
     const  client  = useStreamVideoClient();
     const call = client.call('default', callId);
     call.join({ create: true });
    return(
    
      <StreamCall call={call}>
        <CallContent />
      </StreamCall>
    
    );
}