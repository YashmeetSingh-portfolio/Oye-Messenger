import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, useColorScheme, View
} from "react-native";
import { useMMKVObject } from "react-native-mmkv";

type GlobalPreferences = {
    imageUri?: string;
};

const GRID_ITEM_WIDTH = "31%";

const BRIGHT_IMAGES = [
    "https://images.unsplash.com/photo-1549125764-91425ca48850?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549241520-425e3dfc01cb?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1554226321-24fdcddd5a55?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550006490-9f0656b79e9d?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1551506448-074afa034c05?auto=format&fit=crop&w=800&q=60",
    
    "https://images.unsplash.com/vector-1750764481268-6afadf500141?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGFyayUyMHdhbGxwYXBlcnxlbnwwfDF8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",

    "https://images.unsplash.com/vector-1760731299369-e73a64a6200a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFyayUyMHdhbGxwYXBlcnxlbnwwfDF8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/vector-1749322324151-06d64f1580fd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGFyayUyMHdhbGxwYXBlcnxlbnwwfDF8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/vector-1760643613437-3f2a13a62c47?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFyayUyMHdhbGxwYXBlcnxlbnwwfDF8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/photo-1513569771920-c9e1d31714af?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGFyayUyMHdhbGxwYXBlcnxlbnwwfDF8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGFyayUyMHdhbGxwYXBlcnxlbnwwfDF8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFyayUyMHdhbGxwYXBlcnxlbnwwfDF8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/photo-1524602997322-c1900e093d3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRhcmslMjB3YWxscGFwZXJ8ZW58MHwxfDB8fHwy&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/vector-1747405360138-646f02b8d0f7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGlnaHQlMjB3YWxscGFwZXJ8ZW58MHwxfDB8fHwy&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/vector-1755257875948-46f857d061b2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxpZ2h0JTIwd2FsbHBhcGVyfGVufDB8MXwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/vector-1757184675166-9041576ee08a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxpZ2h0JTIwd2FsbHBhcGVyfGVufDB8MXwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/vector-1738758602052-bfe14728d019?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGlnaHQlMjBiYWNrZ3JvdW5kfGVufDB8MXwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=600",
].map((imageUri) => ({ imageUri }));

export default function WallpaperOverviewScreen() {
    const [globalPrefs, setGlobalPrefs] =
        useMMKVObject<GlobalPreferences>("global_wallpaper");

    const colorScheme = useColorScheme();

    const handleSelect = (imageUri?: string) => {
        setGlobalPrefs(imageUri ? { imageUri } : { imageUri: undefined });
        router.back();
    };

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: colorScheme === "dark" ? "#000" : "#fff" },
            ]}
        >
            <ScrollView style={styles.screen}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color={colorScheme === "dark" ? "white" : "black"}
                        />
                    </Pressable>
                    <Text
                        style={[
                            styles.title,
                            { color: colorScheme === "dark" ? "white" : "black" },
                        ]}
                    >
                        Choose a Wallpaper
                    </Text>
                    <Pressable onPress={() => handleSelect(undefined)} style={styles.resetButton}>
                        <Ionicons
                            name="refresh"
                            size={20}
                            color={colorScheme === "dark" ? "white" : "black"}
                        />
                        <Text
                            style={[
                                styles.resetText,
                                { color: colorScheme === "dark" ? "white" : "black" },
                            ]}
                        >
                            Default
                        </Text>
                    </Pressable>

                </View>

                {/* Wallpaper Grid */}
                <View style={styles.container}>
                    {/* Default color preview */}
                    <Pressable
                        onPress={() => handleSelect(undefined)}
                        style={[
                            styles.colorPreview,
                            {
                                backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
                                borderColor: colorScheme === "dark" ? "#444" : "#ccc",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                color: colorScheme === "dark" ? "#fff" : "#000",
                                fontWeight: "500",
                            }}
                        >
                            Default ({colorScheme === "dark" ? "Dark" : "Light"})
                        </Text>
                    </Pressable>

                    {BRIGHT_IMAGES.map(({ imageUri }, i) => (
                        <Pressable
                            key={i}
                            onPress={() => handleSelect(imageUri)}
                            style={styles.imageWrapper}
                        >
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    resetButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    resetText: {
        fontSize: 14,
    },
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
    },
    imageWrapper: {
        width: GRID_ITEM_WIDTH,
        height: 120,
        marginBottom: 10,
        borderRadius: 12,
        overflow: "hidden",
        elevation: 3,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    colorPreview: {
        width: GRID_ITEM_WIDTH,
        height: 120,
        marginBottom: 10,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
    },
    screen:{
        marginTop:50,
    }
});
