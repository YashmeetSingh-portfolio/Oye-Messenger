import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {
  firebaseDataHandler,
  isFirebaseStreamVideoMessage,
} from '@stream-io/video-react-native-sdk';
import 'expo-router/entry';
import { StreamChat } from 'stream-chat';
import { supabase } from './src/lib/supabase';
import { setForegroundMessageHandler } from './src/utils/setForegroundMessageHandler';
import { setNotifeeListeners } from './src/utils/setNotifeeListeners';
import { setPushConfig } from './src/utils/setPushConfig';
import { tokenProvider } from './src/utils/tokenProvider';

setPushConfig();
setNotifeeListeners();
setForegroundMessageHandler();
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Check if it's a Stream Video call notification first
  if (isFirebaseStreamVideoMessage(remoteMessage)) {
    await firebaseDataHandler(remoteMessage.data);
    return;
  }

  // Handle Stream Chat notifications
  const {data: {session}} = await supabase.auth.getSession();
  if (!session?.user) {
    console.log('No user session found. Cannot handle background message.');
    return;
  }

  if (!process.env.EXPO_PUBLIC_STREAM_API_KEY) {
    throw new Error('EXPO_PUBLIC_STREAM_API_KEY is not defined');
  }
  const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);
  
  client._setToken(
    {
      id: session.user.id,
    },
    tokenProvider,
  );


  if (!remoteMessage.data?.id || typeof remoteMessage.data.id !== 'string') {
    console.log('Invalid message data');
    return;
  }
  const message = await client.getMessage(remoteMessage.data.id);

  const channelId = await notifee.createChannel({
    id: 'chat-messages',
    name: 'Chat Messages',
  });
  const { stream, ...rest } = remoteMessage.data ?? {};
  const data = {
    ...rest,
    ...((stream as unknown as Record<string, string> | undefined) ?? {}),
  };
  await notifee.displayNotification({
    title: 'New message from ' + message.message.user?.name,
    body: message.message.text,
    data,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
});