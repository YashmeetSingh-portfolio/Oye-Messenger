import UserListItem from '@/src/components/UserListItem';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

type Profile = {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  [key: string]: any;
};

export default function SearchUsersScreen() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // server-side filtering using Supabase ILIKE (case-insensitive)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('full_name', `%${query}%`)
          .neq('id', user?.id); // exclude current user

        if (error) console.error('Error searching users:', error);
        else setResults(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? 'black' : 'white' },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={28}
            color={isDark ? 'white' : 'black'}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>
          Search Users
        </Text>
      </View>

      {/* Search Input */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0',
            color: isDark ? 'white' : 'black',
          },
        ]}
        placeholder="Search by name..."
        placeholderTextColor={isDark ? '#AAA' : '#666'}
        value={query}
        onChangeText={setQuery}
      />

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          color={isDark ? 'white' : 'black'}
          style={{ marginTop: 20 }}
        />
      )}

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserListItem user={item} />}
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <Text
              style={{
                color: isDark ? '#777' : '#444',
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              No matching users found
            </Text>
          ) : null
        }
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  input: {
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginHorizontal: 20,
  },
});
