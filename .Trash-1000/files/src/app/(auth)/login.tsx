import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, AppState, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../../lib/supabase';
// New Import: Using Ionicons for the icons
import { Ionicons } from '@expo/vector-icons';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        {/* REPLACED RNE INPUT WITH RN VIEW/TEXT/TEXTINPUT */}
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#666" style={styles.icon} />
          <TextInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
            keyboardType="email-address"
            style={styles.textInput}
          />
        </View>
      </View>

      <View style={styles.verticallySpaced}>
        {/* REPLACED RNE INPUT WITH RN VIEW/TEXT/TEXTINPUT */}
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.icon} />
          <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
            style={styles.textInput}
          />
        </View>
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        {/* REPLACED RNE BUTTON WITH RN PRESSABLE */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed || loading ? 0.7 : 1 },
            loading && styles.buttonDisabled,
          ]}
          onPress={signInWithEmail}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Sign in'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.verticallySpaced}>
        <Link href="/signup" style={styles.signUpLink}>
          Don't have an account? Sign up
        </Link>
      </View>
    </View>
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
  signUpLink: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
  },
  
  // --- NEW STYLES FOR NATIVE COMPONENTS ---

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
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingVertical: 10, // Added to ensure proper vertical alignment
  },
  button: {
    backgroundColor: '#007BFF', // Primary button color
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45,
  },
  buttonDisabled: {
    backgroundColor: '#a0c7ff', // Lighter shade for disabled state
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
})