import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '../providers/AuthProvider';
import UserAvatar from './UserAvatar';

type User = {
  id: string;
  full_name: string;
  avatar_url?: string | null;
};

type Props = {
  user: User;
  forceLight?: boolean; // 👈 NEW optional prop
};

const UserListItem = ({ user, forceLight = false }: Props) => {
  const { user: me } = useAuth();
  const { client } = useChatContext();
  const colorScheme = useColorScheme();
  const isDark = !forceLight && colorScheme === 'dark'; // 👈 respect prop

  const onPress = async () => {
    const channel = client.channel('messaging', {
      members: [me?.id!, user.id],
    });
    await channel.watch();
    router.push(`/channel/${channel.cid}`);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#000' : '#fff',
          borderBottomColor: isDark ? '#222' : '#e0e0e0',
        },
      ]}
      onPress={onPress}
    >
      <UserAvatar url={user.avatar_url} size={40} />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.fullNameText,
            { color: isDark ? '#fff' : '#222' },
          ]}
          numberOfLines={1}
        >
          {user.full_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  fullNameText: {
    fontWeight: '500',
    fontSize: 15,
  },
});

export default UserListItem;
