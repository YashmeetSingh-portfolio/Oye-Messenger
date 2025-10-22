import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '../providers/AuthProvider';
import UserAvatar from './UserAvatar';

type User = {
  id: string;
  full_name: string;
  avatar_url?: string | null;
};

const UserListItem = ({ user }: { user: User }) => {
  const { user: me } = useAuth();
  const { client } = useChatContext();

  const onPress = async () => {
    const channel = client.channel('messaging', {
      members: [me?.id!, user.id],
    });
    await channel.watch();
    router.push(`/channel/${channel.cid}`);
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <UserAvatar url={user.avatar_url} size={40} />
      <View style={styles.textContainer}>
        <Text style={styles.fullNameText} numberOfLines={1}>
          {user.full_name}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,  // smaller vertical padding
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  textContainer: {
    marginLeft: 10, // smaller gap between avatar and name
    flex: 1,
    justifyContent: 'center',
  },
  fullNameText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#222',
  },
});

export default UserListItem;
