import UserAvatar from '@/src/components/UserAvatar';
import { useAuth } from '@/src/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import * as Crypto from 'expo-crypto';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Channel as ChannelType } from 'stream-chat';
import { Channel, MessageInput, MessageList, useChatContext } from 'stream-chat-expo';

export default function ChannelScreen() {
    const [channel, setChannel] = useState<ChannelType | null>(null);
    const [otherUser, setOtherUser] = useState<any>(null);
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const { cid } = useLocalSearchParams<{cid: string}>();
    const { client } = useChatContext();
    const { user: me } = useAuth();
    const videoClient = useStreamVideoClient();

    useEffect(() => {
        const fetchChannel = async () => {
            const channels = await client.queryChannels({ cid });
            const ch = channels[0];
            setChannel(ch);
            if (ch) {
                const members = Object.values(ch.state.members || {});
                const other = members.find((m: any) => m.user?.id !== me?.id)?.user;
                setOtherUser(other);
                setIsOnline(!!other?.online);
            }
        };
        fetchChannel();
    }, [cid, me?.id]);

 const joinCall = async() => {
        
        // 1. Get the channel members and ensure we have their full user data.
        const membersFromChannel = Object.values(channel?.state.members || {});
        
        // 2. Map members to the required Stream Video format.
        //    This format MUST include the 'user' object with 'name' to ensure proper display.
        const members = membersFromChannel.map(member => ({
            user_id: member.user.id,
            // 💡 CRUCIAL FIX: Provide the full user object with the name.
            user: {
                id: member.user.id,
                // Use the name from the channel state, falling back to ID if necessary
                name: member.user.name || member.user.id, 
                image: member.user.image,
            }
        }));

        const call = videoClient.call('default', Crypto.randomUUID());
        
        await call.getOrCreate({
            ring: true,
            data:{
                // Send the structured members array to correctly sync user data to Stream Video
                members: members, 
            },
        });
        
        // 3. Add navigation to the call screen here.
        // router.push({ pathname: '/call', params: { callId: call.id } }); // Example
    }
    const CustomHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                {/* Header Left: Takes up most space and contains the user details */}
                <View style={styles.headerLeft}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.ChannelDetails}>
                        <View style={styles.avatarStatusWrapper}>
                            <UserAvatar url={otherUser?.image} size={44} />
                            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4cd137' : '#b2bec3' }]} />
                        </View>
                        <View style={styles.nameAndStatusWrapper}>
                            <Text 
                                style={styles.headerTitle}
                                numberOfLines={1} // 👈 Enforce single line
                                ellipsizeMode='tail' // 👈 Truncate with "..."
                            >
                                { otherUser?.name || 'Chat'}
                            </Text>
                            <Text style={styles.statusText}>
                                {isOnline ? 'Active now' : 'Offline'}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* Header Right: Fixed size for the call button */}
                <View style={styles.headerRight}>
                    <Ionicons name="call" size={24} color="gray" style={{ marginRight: 20 }} onPress={joinCall}/>
                </View>
            </View>
        </View>
    );

    if (!channel) {
        return <ActivityIndicator />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader />
            <View style={{ flex: 1 }}>
                <Channel 
                    channel={channel}
                >
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={124}
                    >
                        <View style={styles.chatContainer}>
                            <MessageList />
                            <MessageInput />
                        </View>
                    </KeyboardAvoidingView>
                </Channel>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    
    headerContent:{
        // ❌ Removed fixed width: width: 387,
        flex: 1, // 👈 Added flex: 1 for responsiveness
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ChannelDetails:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        // Make ChannelDetails flexible to push name truncation
        flex: 1, 
        overflow: 'hidden', // Needed for text truncation within flexible view
    },
    avatarStatusWrapper: {
        position: 'relative',
        // ❌ Removed redundant marginRight: 10 as it's handled by gap: 10 on ChannelDetails
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameAndStatusWrapper: {
        // 👈 New style to ensure the name section is flexible
        flex: 1,
        overflow: 'hidden',
    },
    statusDot: {
        position: 'absolute',
        bottom: 2,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 2,
    },
    statusText: {
        fontSize: 13,
        color: '#888',
        marginLeft: 3, // Changed from 5 to 3 to align better with title
        marginTop: 2,
    },
    headerLeft:{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // 👈 Ensures headerLeft takes up all available horizontal space
        // ❌ Removed fixed width: width: '60%',
        overflow: 'hidden', // Ensures content inside doesn't spill over
    },
    headerRight:{
        // No changes needed here, as headerLeft will take up the rest of the space
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Changed to center to ensure headerContent is centered
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: 'white',
        height: 124,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffffff',
        // boxShadow property for web/iOS - typically handled by elevation/shadow properties on RN mobile
    },
    AvatarFrame:{
        width:44,
        height:44,
        borderRadius:22,
        backgroundColor:'#ccc',
        marginRight:10,
    },
    backButton: {
        padding: 8,
        marginRight: 10, // Adjusted for better spacing
    },
    headerTitle: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 3, // Adjusted from 3 for consistency
        // Note: Truncation props are applied directly in the component (numberOfLines, ellipsizeMode)
    },
    placeholder: {
        // Not needed anymore since headerRight is fixed and headerContent uses space-between
        width: 0, 
    },
    chatContainer: {
        flex: 1,
        backgroundColor: 'red',
    },
});