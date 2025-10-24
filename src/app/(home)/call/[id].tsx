import {
  RingingCallContent,
  StreamCall,
  useCalls
} from "@stream-io/video-react-native-sdk";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";

``






export default function CallScreen() {

     const {id} = useLocalSearchParams<{id: string}>();
     const calls = useCalls();
     const call = calls[0];
    //   const  client  = useStreamVideoClient();
    //   const [call, setCall] = React.useState<Call>();
     

     
 
    //  useEffect(() => {
    //   const fetchCall = async () => {
    //      const call = client?.call('default', id);
    //     await call?.get();
    //     setCall(call);
    //   };
    //   fetchCall();
    //   return () => {
    //     if(call){
    //     call?.leave();}
    //   };
    //  }, [id]);
     
      if(!call){ 

        if(router.canGoBack()){
          router.back();
      }
      else{
        router.push('/')
      }
      return null;
    }

    return(
    
      <StreamCall call={call}>
        <RingingCallContent />
      </StreamCall>
    
    );
}

function useStreamVideoClient() {
  throw new Error("Function not implemented.");
}
