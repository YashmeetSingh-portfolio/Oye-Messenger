import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { useChatContext } from "stream-chat-expo";

export default function SearchScreen() {
  const { client } = useChatContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme(); // "light" or "dark"

  const currentUserId = client?.userID;
  const isDark = colorScheme === "dark";

  const colors = {
    background: isDark ? "#000" : "#fff",
    text: isDark ? "#fff" : "#000",
    placeholder: isDark ? "#888" : "#777",
    inputBg: isDark ? "#1E1E1E" : "#F2F2F2",
    border: isDark ? "#222" : "#ddd",
    noResults: isDark ? "#888" : "#666",
  };

  useEffect(() => {
    const fetchChannels = async () => {
      if (!client || !currentUserId) return;

      if (query.trim().length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const channels = await client.queryChannels({
          type: "messaging",
          members: { $in: [currentUserId] },
        });

        const matched = channels.filter((channel) => {
          const otherMember = Object.values(channel.state.members).find(
            (m: any) => m.user.id !== currentUserId
          );
          const otherName = otherMember?.user?.name?.toLowerCase() ?? "";
          return otherName.includes(query.toLowerCase());
        });

        setResults(matched);
      } catch (err) {
        console.error("Error searching channels:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchChannels, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleChannelSelect = (channel: any) => {
    router.push(`/channel/${channel.cid}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
      </View>

      {/* Search Input */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.inputBg, color: colors.text },
        ]}
        placeholder="Search users..."
        placeholderTextColor={colors.placeholder}
        value={query}
        onChangeText={setQuery}
      />

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          color={isDark ? "white" : "black"}
          style={{ marginTop: 20 }}
        />
      )}

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.cid}
        renderItem={({ item }) => {
          const otherMember = Object.values(item.state.members).find(
            (m: any) => m.user.id !== currentUserId
          );
          const otherUser = otherMember?.user;
          return (
            <TouchableOpacity
              style={[styles.resultItem, { borderBottomColor: colors.border }]}
              onPress={() => handleChannelSelect(item)}
            >
              <Text style={[styles.resultText, { color: colors.text }]}>
                {otherUser?.name || "Unknown User"}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <Text style={[styles.noResults, { color: colors.noResults }]}>
              No matching users
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  input: {
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  resultItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
  },
  noResults: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 15,
  },
});
