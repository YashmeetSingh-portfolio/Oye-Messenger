import UserAvatar from '@/src/components/UserAvatar';
import { useAuth } from '@/src/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons'; // or any icon library you're using
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Channel as ChannelType } from 'stream-chat';
import { Channel, MessageInput, MessageList, useChatContext } from 'stream-chat-expo';


import * as Crypto from 'expo-crypto';





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
                // Find the other member (not me)
                const members = Object.values(ch.state.members || {});
                const other = members.find((m: any) => m.user?.id !== me?.id)?.user;
                setOtherUser(other);
                setIsOnline(!!other?.online);
            }
        };
        fetchChannel();
    }, [cid, me?.id]);

    const joinCall = async() => {
        
        const members = Object.values(channel?.state.members).map(member => ({user_id: member.user.id}));
        const call = videoClient.call('default', Crypto.randomUUID());
        await call.getOrCreate({
            data:{
                members:members,
            },
        });

        router.push('/call');
        
    }

    const CustomHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.ChannelDetails}>
                        <View style={styles.avatarStatusWrapper}>
                            <UserAvatar url={otherUser?.avatar_url || otherUser?.image} size={44} />
                            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4cd137' : '#b2bec3' }]} />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>
                                {otherUser?.full_name || otherUser?.name || 'Chat'}
                            </Text>
                            <Text style={styles.statusText}>
                                {isOnline ? 'Active now' : 'Offline'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <Ionicons name="call" size={24} color="gray" style={{ marginRight: 20 }} onPress={joinCall}/>
                </View>
                <View style={styles.placeholder} />
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
                    // Disable the default header
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
        width: 387,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        



    },
    ChannelDetails:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatarStatusWrapper: {
        position: 'relative',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginLeft: 5,
        marginTop: 2,
    },
    headerLeft:{
        flexDirection: 'row',
        alignItems: 'center',
       
        width: '60%',
       
    },
    headerRight:{},

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: 'white',
        height: 124,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffffff',
        boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.48)',

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
        marginRight: 15,
    },
    headerTitle: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 3,
    },
    placeholder: {
        width: 40, // Same as back button for balance
    },
    chatContainer: {
        flex: 1,
        backgroundColor: 'red',
    },
});