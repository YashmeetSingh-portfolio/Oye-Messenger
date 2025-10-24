import notifee from '@notifee/react-native';
import {
  isNotifeeStreamVideoEvent,
  onAndroidNotifeeEvent,
} from '@stream-io/video-react-native-sdk';
import { Platform } from 'react-native';

export const setNotifeeListeners = () => {
  // on press handlers of background notifications for Android
  notifee.onBackgroundEvent(async (event) => {
    if (isNotifeeStreamVideoEvent(event)) {
      await onAndroidNotifeeEvent({ event, isBackground: true });
    } else {
      // your other notifications (if any)
    }
  });
  // on press handlers of foreground notifications for Android
  notifee.onForegroundEvent((event) => {
    if (Platform.OS === 'android' && isNotifeeStreamVideoEvent(event)) {
      onAndroidNotifeeEvent({ event, isBackground: false });
    } else {
      // your other notifications (if any)
    }
  });
};