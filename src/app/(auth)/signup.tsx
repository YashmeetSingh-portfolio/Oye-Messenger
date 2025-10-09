import { useAuth } from '@/src/providers/AuthProvider'
import { Button, Input } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { Alert, AppState, ScrollView, StyleSheet, View } from 'react-native'
import Avatar from '../../components/Avatar'
import { supabase } from '../../lib/supabase'

// ... (AppState listener and getProfile function remain the same)
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function createAccount() {

    const { session } = useAuth();

    const [username, setUsername] = useState('')
    const [fullName, setFullname] = useState('')
    const [website, setWebsite] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)


     useEffect(() => {
            if (session) getProfile()
        }, [session])
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
            {/* ... Your Inputs for Email, Password, Avatar, Full Name, Username, Website ... */}
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                />
            </View>

            <View style={{ alignItems: 'center' }}>
                <Avatar
                    size={200}
                    url={avatarUrl}
                    onUpload={(url: string) => {
                        setAvatarUrl(url)
                        // This updateProfile will use the existing 'session' user id
                        if (session) {
                            updateProfile({ username, website, avatar_url: url, full_name: fullName })
                        }
                    }}
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input label="Email" value={session?.user?.email} disabled />
            </View>
            <View style={styles.verticallySpaced}>
                <Input label="Full Name" value={fullName || ''} onChangeText={(text) => setFullname(text)} />
            </View>
            <View style={styles.verticallySpaced}>
                <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
            </View>
            <View style={styles.verticallySpaced}>
                <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
            </View>
            
            {/* The commented out Update button is fine, it uses the existing session */}
            {/* <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button
                    title={loading ? 'Loading ...' : 'Update'}
                    onPress={() => updateProfile({ username, website, avatar_url: avatarUrl, full_name: fullName })}
                    disabled={loading}
                />
            </View> */}

            <View style={styles.verticallySpaced}>
                <Button 
            title="Sign up" 
            disabled={loading} 
            onPress={signUpWithEmail} // ONLY call signUpWithEmail
        />
            </View>

        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
})

function getProfile() {
    // This function needs to be properly implemented to fetch the user's profile data
    // based on session.user.id and populate the state (username, fullName, website, avatarUrl)
    throw new Error('Function not implemented.')
}