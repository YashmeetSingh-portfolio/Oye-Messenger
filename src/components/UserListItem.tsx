import React from 'react';
import { Text, View } from 'react-native';

type User = {
  id: string;
  full_name: string;
  avatar_url?: string | null;
};

const UserListItem = ({ user }: { user: User }) => {
  return (
    <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text style={{ fontWeight: '600' }}>{user.full_name}</Text>
    </View>
  );
};

export default UserListItem;
