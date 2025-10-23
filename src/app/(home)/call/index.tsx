import {
    CallContent,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User
} from "@stream-io/video-react-native-sdk";
import React from "react";



const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
const userId = "af578896-e0d7-4b6d-8d7e-c4215b56ab20";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWY1Nzg4OTYtZTBkNy00YjZkLThkN2UtYzQyMTViNTZhYjIwIn0.rJZuWF9MYT8QusEDlL6hYLoxdYES1ig6gKi3ErnMU80";
const callId = "default_7c8989c1-85dc-4f50-ad51-d89443084d53";
const user: User = { id: userId };

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", callId);
call.join({ create: true });

export default function CallScreen() {
    return(
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallContent />
      </StreamCall>
    </StreamVideo>
    );
}