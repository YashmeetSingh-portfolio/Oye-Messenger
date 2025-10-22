import { useAuth } from '@/src/providers/AuthProvider';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
// New Import for icons
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import { supabase } from '../../lib/supabase';


export default function CreateProfile() {
    const { session } = useAuth();
    // Set initial loading to false after successful profile load
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

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
                setFullname(data.full_name);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
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
        username: string
        website: string
        avatar_url: string
        full_name: string
    }) {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');

            const updates = {
                id: session?.user.id,
                username,
                website,
                avatar_url,
                full_name,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                throw error;
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Avatar
                    size={200}
                    url={avatarUrl}
                    onUpload={(url: string) => {
                        setAvatarUrl(url)
                        updateProfile({ username, website, avatar_url: url, full_name: fullName })
                    }}
                />
            </View>
            
            {/* RNE Input replaced with custom InputField View */}
            <InputField 
                label="Email" 
                value={session?.user?.email} 
                disabled 
                iconName="mail-outline"
            />
            {/* RNE Input replaced with custom InputField View */}
            <InputField 
                label="Full Name" 
                value={fullName || ''} 
                onChangeText={setFullname} 
                iconName="person-outline"
            />
            {/* RNE Input replaced with custom InputField View */}
            <InputField 
                label="Username" 
                value={username || ''} 
                onChangeText={setUsername} 
                iconName="at-outline"
            />
            {/* RNE Input replaced with custom InputField View */}
            <InputField 
                label="Website" 
                value={website || ''} 
                onChangeText={setWebsite} 
                iconName="globe-outline"
            />

            {/* RNE Button replaced with Pressable (Update) */}
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        { opacity: pressed || loading ? 0.7 : 1 },
                        loading && styles.buttonDisabled,
                    ]}
                    onPress={() => updateProfile({ username, website, avatar_url: avatarUrl, full_name: fullName })}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Loading ...' : 'Update'}
                    </Text>
                </Pressable>
            </View>

            {/* RNE Button replaced with Pressable (Sign Out) */}
            <View style={styles.verticallySpaced}>
                <Pressable
                    style={({ pressed }) => [
                        styles.signOutButton,
                        { opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={() => supabase.auth.signOut()}
                    disabled={loading}
                >
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

// --- REUSABLE INPUT COMPONENT ---
interface InputFieldProps {
    label: string;
    value: string | undefined;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    disabled?: boolean;
    iconName?: keyof typeof Ionicons.glyphMap; 
}

const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    secureTextEntry = false, 
    autoCapitalize = 'sentences', 
    disabled = false, 
    iconName 
}) => (
    <View style={styles.verticallySpaced}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.inputContainer, disabled && styles.inputDisabledContainer]}>
            {iconName && <Ionicons name={iconName} size={20} color={disabled ? '#999' : '#666'} style={styles.icon} />}
            <TextInput
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                editable={!disabled}
                style={[styles.textInput, disabled && styles.inputDisabledText]}
                // Set keyboard type for email specifically
                keyboardType={label === 'Email' ? 'email-address' : 'default'}
            />
        </View>
    </View>
);


// --- NEW STYLES FOR NATIVE COMPONENTS ---

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 8,
        paddingBottom: 8,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    
    // Input Styles
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    inputDisabledContainer: {
        backgroundColor: '#f0f0f0',
    },
    icon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        paddingVertical: 8,
        color: '#333',
    },
    inputDisabledText: {
        color: '#999',
    },

    // Button Styles (Update)
    button: {
        backgroundColor: '#007BFF', 
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
    },
    buttonDisabled: {
        backgroundColor: '#a0c7ff',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Button Styles (Sign Out)
    signOutButton: {
        backgroundColor: '#dc3545', // A standard red for sign out/danger
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
        marginTop: 10,
    },
    signOutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});