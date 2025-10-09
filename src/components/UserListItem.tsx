import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '../providers/AuthProvider';

type User = {
    id: string;
    full_name: string;
    avatar_url?: string | null;
};


const UserListItem = ({ user }: { user: User }) => {

    const {user: me} = useAuth(); 
    const { client } = useChatContext();
    const onPress = async () => {
        //start chat with user
        const channel = client.channel('messaging', {
            members: [me?.id!, user.id],
    });
    await channel.watch();
    router.replace(`/(home)/channel/${channel.cid}`);
}
    return (
        <Pressable style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }} onPress={onPress}>
            <Text style={{ fontWeight: '600' }}>{user.full_name}</Text>
        </Pressable>
    );
};

export default UserListItem;
