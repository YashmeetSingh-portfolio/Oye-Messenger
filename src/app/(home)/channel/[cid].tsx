import UserAvatar from "@/src/components/UserAvatar";
import { useAuth } from "@/src/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { Channel as ChannelType } from "stream-chat";
import {
    Channel,
    MessageInput,
    MessageList,
    ThemeProvider,
    useChatContext,
    useMessageComposerHasSendableData,
    useMessageInputContext,
} from "stream-chat-expo";
export default function ChannelScreen() {
    const [channel, setChannel] = useState<ChannelType | null>(null);
    const [otherUser, setOtherUser] = useState<any>(null);
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const { cid } = useLocalSearchParams<{ cid: string }>();
    const { client } = useChatContext();
    const { user: me } = useAuth();
    const videoClient = useStreamVideoClient();
    const [globalPrefs] = useMMKVObject<{ imageUri?: string }>("global_wallpaper");
    const colorScheme = useColorScheme();

    const handleMenuOnPress = () => router.push("/(home)/WallpaperOverviewScreen");

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
    const CustomSendButton = () => {
        // Use useMessageInputContext only for the sendMessage function
        const { sendMessage } = useMessageInputContext();

        // Use the dedicated hook to check if there is any text or attachment to send
        const hasSendableData = useMessageComposerHasSendableData();
        const isDisabled = !hasSendableData;

        return (
            <TouchableOpacity
                onPress={() => {
                    if (!isDisabled) {
                        sendMessage();
                    }
                }}
                // Disable the button based on the hook's return value
                disabled={isDisabled}
                style={[
                    styles.button,

                ]}
            >
                <Ionicons name="send" size={30} color={isDisabled ? 'gray' : 'green'} />
            </TouchableOpacity>
        );
    };


    const joinCall = async () => {
        const membersFromChannel = Object.values(channel?.state.members || {});
        const members = membersFromChannel
            .filter((m) => m.user?.id)
            .map((m) => ({
                user_id: m.user!.id,
                user: {
                    id: m.user!.id,
                    name: m.user!.name || m.user!.id,
                    image: m.user?.image || undefined,
                },
            }));
        const call = videoClient?.call("default", Crypto.randomUUID());
        await call?.getOrCreate({ ring: true, data: { members } });
    };

    if (!channel) return <ActivityIndicator style={{ flex: 1 }} />;

    const isDark = colorScheme === "dark";
    const wallpaperUri = globalPrefs?.imageUri ?? null;

    // ✅ Stream Chat custom theme
    const theme = {
        colors: {
            primary: isDark ? "#1E90FF" : "#007AFF",
            background: "transparent",
            text: isDark ? "#f9f9f9" : "#000000ff",
            overlay: "transparent",
        },
        messageList: { container: { backgroundColor: "transparent" } },
        messageInput: {
            container: {
                backgroundColor: isDark ? '#00000027' : "#ffffff2a",

                padding: 8,
                borderRadius: 15,
                margin: 10,
                marginBottom: 30,
                marginTop: 0,


            },

            inputBox: {
                backgroundColor: isDark ? "#2A2A2A" : "#fff",
                borderRadius: 12,
                border: 'none',
                color: isDark ? "#fff" : "#000",
                margin: -2
            },


        },
        messageSimple: {
            content: {
                container: {
                    borderWidth: 0,
                },
                text: {
                    color: '#FFFFFF', // Set text color for all messages
                },
            },
            messageUser: {
                // Sent message bubble styling
                content: {
                    container: {
                        backgroundColor: '#007AFF', // iOS blue for the bubble background
                    },
                },
            },
            messageOther: {
                // Received message bubble styling
                content: {
                    container: {
                        backgroundColor: '#ff0000ff', // Light gray for the bubble background
                    },
                    text: {
                        color: '#ffffffff', // Black text for received messages
                    },
                },
            },
        },
    };

    const backgroundStyle = wallpaperUri
        ? { uri: wallpaperUri }
        : undefined;

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View
                style={[
                    styles.headerContainer,
                    {
                        backgroundColor: isDark
                            ? "rgba(0, 0, 0, 1)"
                            : "rgba(255,255,255,0.85)",
                        borderBottomColor: isDark ? "#000000ff" : "#eee",
                    },
                ]}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
                </TouchableOpacity>

                <View style={styles.userInfo}>
                    <View style={{ position: "relative" }}>
                        <UserAvatar url={otherUser?.image} size={44} />
                        <View
                            style={[
                                styles.statusDot,
                                { backgroundColor: isOnline ? "#4cd137" : "#666" },
                            ]}
                        />
                    </View>

                    <View style={{ marginLeft: 10 }}>
                        <Text
                            numberOfLines={1}
                            style={[styles.userName, { color: isDark ? "#fff" : "#000" }]}
                        >
                            {otherUser?.name || "Chat"}
                        </Text>
                        <Text style={[styles.statusText, { color: "#999" }]}>
                            {isOnline ? "Active now" : "Offline"}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={joinCall}>
                    <Ionicons name="call" size={24} color={isDark ? "#aaa" : "#555"} />
                </TouchableOpacity>
            </View>

            {/* Chat Section */}
            <View style={{ flex: 1 }}>
                <ThemeProvider style={theme}>
                    <Channel channel={channel}>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            keyboardVerticalOffset={85}
                        >
                            {backgroundStyle ? (
                                <ImageBackground
                                    source={backgroundStyle}
                                    style={styles.wallpaper}
                                    resizeMode="cover"
                                >
                                    <View style={getOverlayStyle(isDark)} />
                                    <View style={styles.chatWrapper}>
                                        <MessageList />
                                        <MessageInput SendButton={CustomSendButton} />
                                    </View>
                                </ImageBackground>
                            ) : (
                                <ImageBackground
                                    source={{
                                        uri: isDark
                                            ? 'https://images.unsplash.com/photo-1614292264554-7dca1d6466d6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGFyayUyMGJhY2tncm91bmR8ZW58MHwxfDB8fHwy&auto=format&fit=crop&q=60&w=600'
                                            : 'https://images.unsplash.com/vector-1754119394220-6d2d7a441284?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxpZ2h0JTIwd2FsbHBhcGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600'
                                    }}
                                    style={styles.wallpaper}
                                    resizeMode="cover"
                                >
                                    <View style={styles.chatWrapper}>
                                        <MessageList />
                                        <MessageInput SendButton={CustomSendButton} />
                                    </View>
                                </ImageBackground>
                            )}

                            <Pressable style={styles.wallpaperButton} onPress={handleMenuOnPress}>
                                <Ionicons name="color-palette" size={22} color="#fff" />
                            </Pressable>
                        </KeyboardAvoidingView>
                    </Channel>
                </ThemeProvider>
            </View>
        </View>
    );
}

// ✅ Overlay tint
export const getOverlayStyle = (isDark: boolean) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: isDark
        ? "rgba(0,0,0,0.25)"
        : "rgba(255,255,255,0.1)",
    zIndex: -1,
});

const styles = StyleSheet.create({
    headerContainer: {
        height: 120,
        paddingTop: 50,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5
    },
    buttonText: {
        color: 'white'
    },

    backButton: { padding: 8 },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginLeft: 10,
    },
    userName: {
        fontSize: 17,
        fontWeight: "600",
    },
    statusText: {
        fontSize: 13,
        marginTop: 2,
    },
    statusDot: {
        position: "absolute",
        bottom: 2,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#000",
    },
    wallpaper: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    chatWrapper: {
        flex: 1,
        zIndex: 1,
    },
    wallpaperButton: {
        position: "absolute",
        top: 18,
        right: 16,
        backgroundColor: "rgba(0,0,0,0.45)",
        padding: 10,
        borderRadius: 50,
        zIndex: 10,
    },
});
