import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '../providers/AuthProvider';
import UserAvatar from './UserAvatar'; // Import the new Avatar component

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
    // The channel.watch() call initiates the chat channel and fetches messages.
    await channel.watch();
    // Navigate to the new channel screen
    router.replace(`/(home)/channel/${channel.cid}`);
}
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <UserAvatar url={user.avatar_url} size={50} />
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
        padding: 15,
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Center items vertically
        backgroundColor: 'white', // Give it a background
        borderBottomWidth: StyleSheet.hairlineWidth, // Use hairline for a thin, native line
        borderBottomColor: '#e0e0e0', // Light grey line
    },
    textContainer: {
        marginLeft: 15, // Space between avatar and name
        flex: 1, // Allows text to take up the remaining space
        justifyContent: 'center',
    },
    fullNameText: {
        fontWeight: '600',
        fontSize: 16, // Slightly larger text
        color: '#333', // Darker text color
    }
    // You could add a status or last message preview here if you had that data
});

export default UserListItem;