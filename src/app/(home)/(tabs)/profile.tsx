import { useAuth } from '@/src/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Avatar from '../../../components/Avatar';
import { supabase } from '../../../lib/supabase';

export default function ProfileScreen() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullname] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setFullname(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
  }: {
    username: string;
    website: string;
    avatar_url: string;
    full_name: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');
      const updates = {
        id: session.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      };
      
      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account details</Text>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <Avatar
          size={130}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({ username, website, avatar_url: url, full_name: fullName });
          }}
        />
        <Text style={styles.nameText}>{fullName || 'Your Name'}</Text>
        <Text style={styles.emailText}>{session?.user?.email}</Text>
      </View>

      {/* Inputs */}
      <View style={styles.inputSection}>
        <InputField
          label="Full Name"
          value={fullName}
          onChangeText={setFullname}
          iconName="person-outline"
        />
        <InputField
          label="Username"
          value={username}
          onChangeText={setUsername}
          iconName="at-outline"
        />
        <InputField
          label="Website"
          value={website}
          onChangeText={setWebsite}
          iconName="globe-outline"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.buttonPrimary,
            { opacity: pressed || loading ? 0.7 : 1 },
          ]}
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl, full_name: fullName })}
          disabled={loading}
        >
          <Text style={styles.buttonPrimaryText}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.buttonSecondary,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => supabase.auth.signOut()}
          disabled={loading}
        >
          <Ionicons name="log-out-outline" size={18} color="white" />
          <Text style={styles.buttonSecondaryText}>Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// -------------------- Reusable Input ---------------------
interface InputFieldProps {
  label: string;
  value: string | undefined;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
}) => (
  <View style={styles.inputCard}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputRow}>
      {iconName && <Ionicons name={iconName} size={20} color="#007bff" style={styles.icon} />}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        style={styles.textInput}
        placeholderTextColor="#aaa"
      />
    </View>
  </View>
);

// ---------------------- Styles ----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    color: '#222',
  },
  emailText: {
    color: '#555',
    marginTop: 4,
  },
  inputSection: {
    paddingHorizontal: 20,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    paddingVertical: 4,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    flexDirection: 'row',
    backgroundColor: '#dc3545',
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  buttonSecondaryText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
