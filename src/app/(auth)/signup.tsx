import { useAuth } from '@/src/providers/AuthProvider';
import React, { useEffect, useState } from 'react';
import { Alert, AppState, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
// New Import for icons
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import { supabase } from '../../lib/supabase';

// ... (AppState listener and getProfile function remain the same)
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

export default function CreateAccount() {
    const { session } = useAuth();
    // ... State variables remain the same
    const [username, setUsername] = useState('');
    const [fullName, setFullname] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // ... useEffect and updateProfile/signUpWithEmail functions remain the same
    useEffect(() => {
        if (session) getProfile();
    }, [session]);
    
    // ... (updateProfile function here, identical to your original code)
    async function updateProfile({
        username,
        website,
        avatar_url,
        full_name,
        userId, // Added for sign-up flow
    }: {
        username: string
        website: string
        avatar_url: string
        full_name: string
        userId?: string
    }) {
        try {
            setLoading(true)
            
            // Prioritize the ID passed from the signUp flow, otherwise use the session ID
            const idToUse = userId || session?.user?.id; 

            if (!idToUse) {
                // This shouldn't happen if called correctly
                throw new Error('No user ID available for profile operation!')
            }

            const updates = {
                id: idToUse,
                username,
                website,
                avatar_url,
                full_name,
                updated_at: new Date(),
            }

            // Using upsert is generally safe for profile data whether it's an initial insert or an update
            const { error } = await supabase.from('profiles').upsert(updates) 

            if (error) {
                // The most common error here is RLS
                console.error("Supabase Profile Update Error:", error);
                throw error
            }

            // ONLY FOR DEBUGGING: This alert confirms the DB call finished without error
            // Alert.alert('Profile operation successful (check DB)!') 
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("Profile Update Failed: " + error.message)
            }
        } finally {
            setLoading(false)
        }
    }
        
    // ... (signUpWithEmail function here, identical to your original code)
    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session: newSession, user: newUser },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            Alert.alert(error.message)
            setLoading(false)
            return
        }

        // If a session and user are immediately available (Email Confirmation OFF)
        if (newSession && newUser) {
            // Wait for the profile update to complete
            await updateProfile({ 
                username, 
                website, 
                avatar_url: avatarUrl, 
                full_name: fullName, 
                userId: newUser.id 
            }) 
            
            // The loading state will be set to false in updateProfile's finally block
            // and the app will likely navigate to the homepage due to the new session state.
        } else {
            // If no session is returned (Email Confirmation ON)
            Alert.alert('Please check your inbox for email verification!')
            setLoading(false)
            // Profile must be created after user verifies and logs in, or via a Database Trigger
        }
    }

    return (
        <ScrollView style={styles.container}>
            {/* RNE Input replaced with custom InputField View */}
            <InputField
                label="Email"
                iconName="mail-outline"
                onChangeText={setEmail}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={'none'}
            />
            {/* RNE Input replaced with custom InputField View */}
            <InputField
                label="Password"
                iconName="lock-closed-outline"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize={'none'}
            />

            <View style={{ alignItems: 'center' }}>
                <Avatar
                    size={200}
                    url={avatarUrl}
                    onUpload={(url: string) => {
                        setAvatarUrl(url)
                        if (session) {
                            updateProfile({ username, website, avatar_url: url, full_name: fullName })
                        }
                    }}
                />
            </View>
            
            {/* RNE Input replaced with custom InputField View (Disabled) */}
            <InputField 
                label="Email" 
                value={session?.user?.email} 
                disabled 
            />
            {/* RNE Input replaced with custom InputField View */}
            <InputField 
                label="Full Name" 
                value={fullName || ''} 
                onChangeText={setFullname} 
            />
            {/* RNE Input replaced with custom InputField View */}
            <InputField 
                label="Username" 
                value={username || ''} 
                onChangeText={setUsername} 
            />
            {/* RNE Input replaced with custom InputField View */}
            <InputField 
                label="Website" 
                value={website || ''} 
                onChangeText={setWebsite} 
            />

            {/* RNE Button replaced with Pressable */}
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        { opacity: pressed || loading ? 0.7 : 1 },
                        loading && styles.buttonDisabled,
                    ]}
                    onPress={signUpWithEmail}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Loading...' : 'Sign up'}
                    </Text>
                </Pressable>
            </View>

        </ScrollView>
    );
}

// --- NEW REUSABLE INPUT COMPONENT ---
interface InputFieldProps {
    label: string;
    value: string | undefined;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    disabled?: boolean;
    iconName?: keyof typeof Ionicons.glyphMap; // Use Ionicons type for safe icon names
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
            />
        </View>
    </View>
);


// ... (getProfile stub remains the same)
function getProfile() {
    throw new Error('Function not implemented.')
}

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
        backgroundColor: '#f0f0f0', // Light gray background for disabled input
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
        color: '#999', // Gray text color for disabled input
    },

    // Button Styles
    button: {
        backgroundColor: '#007BFF', // Standard blue button color
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
    },
    buttonDisabled: {
        backgroundColor: '#a0c7ff', // Lighter shade for disabled state
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});