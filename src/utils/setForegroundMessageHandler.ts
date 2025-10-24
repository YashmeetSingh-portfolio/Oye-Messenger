import messaging from '@react-native-firebase/messaging';
import {
  firebaseDataHandler,
  isFirebaseStreamVideoMessage,
} from '@stream-io/video-react-native-sdk';

export const setForegroundMessageHandler = () => {
  messaging().onMessage((msg) => {
    if (isFirebaseStreamVideoMessage(msg)) {
      firebaseDataHandler(msg.data);
    } else {
      // your other chat messages (if any)
    }
  });
};