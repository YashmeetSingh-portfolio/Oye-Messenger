import messaging from '@react-native-firebase/messaging';
import {
    firebaseDataHandler,
    isFirebaseStreamVideoMessage,
} from '@stream-io/video-react-native-sdk';

export const setPushMessageListeners = () => {
  // Set up the background message handler for Android
  messaging().setBackgroundMessageHandler(async (msg) => {
    if (isFirebaseStreamVideoMessage(msg)) {
      await firebaseDataHandler(msg.data);
    } else {
      // your other messages (if any)
    }
  });
  // Set up the foreground message handler for Android
  messaging().onMessage((msg) => {
    if (isFirebaseStreamVideoMessage(msg)) {
      firebaseDataHandler(msg.data);
    } else {
      // your other messages (if any)
    }
  });

//   if (Platform.OS === 'ios') {
//     // show notification on foreground on iOS
//     Notifications.setNotificationHandler({
//       // example configuration below to show alert and play sound
//       handleNotification: async (notification) => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//       }),
//     });
//   }
};