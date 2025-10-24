import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import 'expo-router/entry';
import { StreamChat } from 'stream-chat';
import { supabase } from './src/lib/supabase';
import { tokenProvider } from './src/utils/tokenProvider';


messaging().setBackgroundMessageHandler(async remoteMessage => {


    const {data: {session}} = await supabase.auth.getSession();
    if (!session?.user) {
        console.log('No user session found. Cannot handle background message.');
        return;
    }

    const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);
    // You can also provide tokenProvider instead of static token
    // await client._setToken({ id: userId }, tokenProvider)
    client._setToken(
        {
            id: session.user.id,
        },
        tokenProvider,
    );
    // handle the message
    const message = await client.getMessage(remoteMessage.data.id);

    const channelId = await notifee.createChannel({
    id: 'chat-messages',
    name: 'Chat Messages',
  });
  const { stream, ...rest } = remoteMessage.data ?? {};
  const data = {
    ...rest,
    ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
  };
  await notifee.displayNotification({
    title: 'New message from ' + message.message.user?.name,
    body: message.message.text,
    data,
    android: {
      channelId,
      // add a press action to open the app on press
      pressAction: {
        id: 'default',
      },
    },
  });


});
