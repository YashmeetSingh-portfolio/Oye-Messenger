import Avatar from '@/src/components/Avatar';
import { useAuth } from '@/src/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullname] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  
  const MyRectangleSvg = `
  <svg width="30" height="3" viewBox="0 0 30 3" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="3" rx="1.5" fill="#E6E6E6"/>
  </svg>
  `;

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

  const handleSaveName = async () => {
    if (tempName.trim() && tempName !== fullName) {
      await updateProfile({
        username,
        website,
        avatar_url: avatarUrl,
        full_name: tempName,
      });
      setFullname(tempName);
    }
    setIsEditingName(false);
  };

  return (
    <View style={styles.container} >
      <View style={styles.upperHalveContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={34} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileDisplayContainer}>
          <Avatar
            size={125}
            url={avatarUrl}
            onUpload={(url: string) => {
              setAvatarUrl(url);
              updateProfile({ username, website, avatar_url: url, full_name: fullName });
            }}
          />
          <Text style={styles.nameText}>{fullName || 'Your Name'}</Text>
        </View>
      </View>

      <View style={styles.LowerHalfContainer}>
        <View style={styles.barContainer}>
          <SvgXml xml={MyRectangleSvg} />
        </View>

        <View style={styles.infoWrapper}>
          <View style={styles.displayNameContainer}>
            <View style={styles.displayNameRow}>
              <Text style={styles.DisplayHeader}>Display Name</Text>
              {isEditingName ? (
                <TouchableOpacity onPress={handleSaveName}>
                  <Ionicons name="checkmark" size={24} color="#000E08" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setTempName(fullName);
                    setIsEditingName(true);
                  }}
                >
                  <Ionicons name="pencil" size={20} color="#797C7B" />
                </TouchableOpacity>
              )}
            </View>

            {isEditingName ? (
              <TextInput
                style={styles.editInput}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                autoFocus
              />
            ) : (
              <Text style={styles.DisplayNameOrEmail}>
                {fullName || 'Your Name'}
              </Text>
            )}
          </View>

          <View style={styles.displayEmailContainer}>
            <Text style={styles.DisplayHeader}>Email Address</Text>
            <Text style={styles.DisplayNameOrEmail}>
              {session?.user?.email}
            </Text>
          </View>
        </View>
      </View>
    </View>
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

// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   iconName,
// }) => (
//   <View style={styles.inputCard}>
//     <Text style={styles.inputLabel}>{label}</Text>
//     <View style={styles.inputRow}>
//       {iconName && <Ionicons name={iconName} size={20} color="#007bff" style={styles.icon} />}
//       <TextInput
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder || label}
//         style={styles.textInput}
//         placeholderTextColor="#aaa"
//       />
//     </View>
//   </View>
// );

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffffff',
  },
  nameText: {
    fontSize: 25,
    fontWeight: '600',
    marginTop: 5,
    color: '#ffffffff',
  },
  upperHalveContainer: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    position: 'absolute',
    top: height * 0.07,
    left: 0,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
  },
  profileDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.12,
  },
  LowerHalfContainer: {
    flex: 0.55,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 25,
  },
  barContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoWrapper: {
    paddingHorizontal: 24,
  },
  displayNameContainer: {
    marginBottom: 30,
  },
  displayEmailContainer: {
    marginTop: 10,
  },
  displayNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  DisplayHeader: {
    color: '#797C7B',
    fontWeight: '400',
    fontSize: 18,
  },
  DisplayNameOrEmail: {
    fontWeight: '500',
    fontSize: 22,
    color: '#000E08',
    marginTop: 4,
  },
  editInput: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000E08',
    borderBottomWidth: 1,
    borderBottomColor: '#C5C5C5',
    marginTop: 4,
    paddingVertical: 2,
  },
});
