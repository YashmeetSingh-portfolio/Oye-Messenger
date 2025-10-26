import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  AppState,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

const HORIZONTAL_PADDING = 32;
const ACTIVE_BUTTON_COLOR_LIGHT = '#008C77';
const ACTIVE_BUTTON_COLOR_DARK = '#66C2A4';
const INACTIVE_BUTTON_COLOR_LIGHT = '#F4F4F4';
const INACTIVE_BUTTON_COLOR_DARK = '#1E1E1E';
const ERROR_COLOR = '#D32F2F';

const validateEmail = (email: string) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});

export default function Signup() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  // Removed avatar state and logic
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  // Corrected the state setter function for showConfirmPass to setShowConfirmPass
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const isEmailInvalid = email.length > 0 && !validateEmail(email);
  const passwordsDontMatch = confirmPass.length > 0 && password !== confirmPass;

  const isFormValid =
    name.length > 0 &&
    email.length > 0 &&
    !isEmailInvalid &&
    password.length >= 6 &&
    confirmPass.length >= 6 &&
    !passwordsDontMatch;

  const buttonBgColor = isFormValid
    ? isDark ? ACTIVE_BUTTON_COLOR_DARK : ACTIVE_BUTTON_COLOR_LIGHT
    : isDark ? INACTIVE_BUTTON_COLOR_DARK : INACTIVE_BUTTON_COLOR_LIGHT;

  const buttonTextColor = isFormValid
    ? isDark ? '#000' : '#fff'
    : isDark ? '#777' : '#999';

  async function handleSignUp() {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please ensure all fields are filled correctly and passwords match.');
      return;
    }

    setLoading(true);

    // 1. Sign up the user
    const {
      data: { user: newUser },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      Alert.alert(signUpError.message);
      setLoading(false);
      return;
    }

    if (newUser) {
      // 2. Create the profile in the database
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: newUser.id,
        full_name: name,
        username: null,
        avatar_url: '', // Explicitly set to empty string, to be updated later
        updated_at: new Date(),
      });

      if (profileError) {
        console.error("Profile insertion error:", profileError);
      }
    }

    Alert.alert(
      'Success!',
      'Account created successfully. Please check your inbox for verification.'
    );
    setLoading(false);
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#fff' },
      ]}
    >
      <Pressable
        style={styles.backArrow}
        onPress={() => router.back()}
        accessibilityLabel="Go back"
      >
        <FontAwesome6 name="arrow-left-long" size={24} color={isDark ? '#fff' : '#000'} />
      </Pressable>
      <Text
        style={[
          styles.title,
          { color: isDark ? '#fff' : '#000' },
        ]}
      >
        <Text style={styles.titleBold}>Sign up</Text> to Chatbox
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: isDark ? '#999' : '#555' },
        ]}
      >
        Create an account to continue
      </Text>

      <View style={{ marginTop: 10 }}>
        <TextInput
          placeholder="Full name"
          placeholderTextColor={isDark ? '#888' : '#777'}
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            {
              color: isDark ? '#fff' : '#000',
              borderBottomColor: isDark ? '#333' : '#ccc',
            },
          ]}
        />
        <TextInput
          placeholder="Your email"
          placeholderTextColor={isDark ? '#888' : '#777'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            {
              color: isDark ? '#fff' : '#000',
              borderBottomColor: isEmailInvalid ? ERROR_COLOR : (isDark ? '#333' : '#ccc'),
              marginBottom: isEmailInvalid ? 8 : 24,
            },
          ]}
        />
        {isEmailInvalid && (
          <Text style={styles.errorText}>Please enter a valid email address.</Text>
        )}

        <View style={[
          styles.passwordInputContainer,
          { borderBottomColor: isDark ? '#333' : '#ccc', marginTop: isEmailInvalid ? 16 : 0 }
        ]}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={isDark ? '#888' : '#777'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[styles.passwordInput, { color: isDark ? '#fff' : '#000' }]}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={isDark ? '#888' : '#777'}
            />
          </Pressable>
        </View>

        <View style={[
          styles.passwordInputContainer,
          { borderBottomColor: passwordsDontMatch ? ERROR_COLOR : (isDark ? '#333' : '#ccc'), marginBottom: passwordsDontMatch ? 8 : 24 }
        ]}>
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor={isDark ? '#888' : '#777'}
            value={confirmPass}
            onChangeText={setConfirmPass}
            secureTextEntry={!showConfirmPass}
            style={[styles.passwordInput, { color: isDark ? '#fff' : '#000' }]}
          />
          {/* CORRECTED: The onPress handler now correctly uses setShowConfirmPass */}
          <Pressable onPress={() => setShowConfirmPass(!showConfirmPass)}>
            <Ionicons
              name={showConfirmPass ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={isDark ? '#888' : '#777'}
            />
          </Pressable>
        </View>
        {passwordsDontMatch && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}

        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: buttonBgColor,
              opacity: loading || !isFormValid ? 0.7 : 1,
              marginTop: passwordsDontMatch ? 16 : 10,
            },
          ]}
          onPress={handleSignUp}
          disabled={loading || !isFormValid}
        >
          <Text
            style={[
              styles.buttonText,
              { color: buttonTextColor },
            ]}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </Text>
        </Pressable>

        <Link
          href="/login"
          style={[
            styles.altLink,
            { color: isDark ? '#66C2A4' : '#006B5C' },
          ]}
        >
          Already have an account? Log in
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 80,
  },
  backArrow: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 8,
  },
  titleBold: {
    fontWeight: '700',
    color: '#008C77',
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 24,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingRight: 10,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  altLink: {
    textAlign: 'center',
    marginTop: 24,
    fontWeight: '500',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: ERROR_COLOR,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    paddingLeft: 2,
  }
});