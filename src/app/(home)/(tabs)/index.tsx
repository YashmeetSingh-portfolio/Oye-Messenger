import AvatarDisplay from '@/src/components/AvatarDisplay';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { Channel } from 'stream-chat';
import { ChannelList } from 'stream-chat-expo';


export default function MainTabScreen() {

    const { session } = useAuth();
    const [loading, setLoading] = useState(true);

    const [channel, setChannel] = useState<Channel | null>(null);
    const { user } = useAuth();
    const [avatarUrl, setAvatarUrl] = useState(null);

    const MyRectangleSvg = `
<svg width="30" height="3" viewBox="0 0 30 3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="3" rx="1.5" fill="#E6E6E6"/>
</svg>
`;


    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`avatar_url`)
                .eq('id', session?.user.id)
                .single();

            if (error && status !== 406) throw error;
            if (data) setAvatarUrl(data.avatar_url);
        } catch (error) {
            if (error instanceof Error) Alert.alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (session) getProfile();
    }, [session]);



    return (
        <View style={styles.screen}>

            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.searchIconContainer}
                        onPress={() => router.push("/search")}
                    >
                        <Image
                            source={require("../../../../assets/images/SearchIcon.png")}
                            style={styles.SearchIcon}
                        />
                    </TouchableOpacity>

                    <Text style={styles.title} >Home</Text>
                    <TouchableOpacity style={styles.avatarContainer}
                        onPress={() => router.push("/profile")}>
                        <AvatarDisplay size={46} url={avatarUrl} />
                    </TouchableOpacity>




                </View>





            </View>
            <View style={styles.chatListContainer}>
                <View style={styles.barContainer}>      <SvgXml xml={MyRectangleSvg} />
                </View>

                {user && (
                    <ChannelList

                        filters={{ members: { $in: [user.id] } }}
                        onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
                    />
                )}


            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
    headerContainer: {
        width: 327,
        height: 44,
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 61,
        left: 18,
        flexDirection: 'row',

    },
    screen: {
        flex: 1,
        backgroundColor: 'black'
    },
    searchIconContainer: {
        width: 44,
        height: 44,


        borderWidth: 2,
        borderColor: '#363F3B',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',



    },
    SearchIcon: {
        width: 24,
        height: 24,
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 700,
    },
    avatarContainer: {
        width: 46,
        height: 46,
        borderRadius: 22,
        backgroundColor: '#363F3B',

    },
    chatListContainer: {
        position: 'absolute',
        height: '90%',
        backgroundColor: '#ffffffff',
        width: '100%',
        top: 180,
        left: 0,
        borderRadius: 40,
        paddingTop: 20,
        paddingHorizontal: 20,

    },
    barContainer: {
        alignItems: 'center',
        marginBottom: 20,


    },




});



