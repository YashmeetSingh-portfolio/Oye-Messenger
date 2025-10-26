import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
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

const ACTIVE_BUTTON_COLOR_LIGHT = '#008C77';
const ACTIVE_BUTTON_COLOR_DARK = '#66C2A4';
const INACTIVE_BUTTON_COLOR_LIGHT = '#F4F4F4';
const INACTIVE_BUTTON_COLOR_DARK = '#1E1E1E';
const ERROR_COLOR = '#D32F2F';
const HORIZONTAL_PADDING = 32;

const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
};

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailInvalid = email.length > 0 && !validateEmail(email);

  const isFormValid = email.length > 0 && !isEmailInvalid && password.length > 0;

  const buttonBgColor = isFormValid
    ? isDark ? ACTIVE_BUTTON_COLOR_DARK : ACTIVE_BUTTON_COLOR_LIGHT
    : isDark ? INACTIVE_BUTTON_COLOR_DARK : INACTIVE_BUTTON_COLOR_LIGHT;

  const buttonTextColor = isFormValid
    ? isDark ? '#000' : '#fff'
    : isDark ? '#777' : '#999';

  async function signInWithEmail() {
    if (!isFormValid) {
        Alert.alert('Validation Error', 'Please ensure all fields are filled correctly.');
        return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert(error.message);
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

      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.title,
            { color: isDark ? '#fff' : '#000' },
          ]}
        >
          <Text style={styles.titleBold}>Log in</Text> to Chatbox
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? '#999' : '#555' },
          ]}
        >
          Welcome back! Sign in using your email to continue with us
        </Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Your email"
          placeholderTextColor={isDark ? '#888' : '#777'}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.textInput,
            {
              color: isDark ? '#fff' : '#000',
              borderBottomColor: isEmailInvalid ? ERROR_COLOR : (isDark ? '#333' : '#ccc'),
              marginBottom: isEmailInvalid ? 8 : 30,
            },
          ]}
        />
        {isEmailInvalid && (
            <Text style={styles.errorText}>Please enter a valid email address.</Text>
        )}
      </View>

      <View style={[
          styles.passwordInputContainer, 
          { 
              borderBottomColor: isDark ? '#333' : '#ccc', 
              marginBottom: 30,
              marginTop: isEmailInvalid ? 10 : 0,
          }
      ]}>
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor={isDark ? '#888' : '#777'}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
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

      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: buttonBgColor,
            opacity: loading || !isFormValid ? 0.7 : 1,
          },
        ]}
        onPress={signInWithEmail}
        disabled={loading || !isFormValid}
      >
        <Text
          style={[
            styles.buttonText,
            { color: buttonTextColor },
          ]}
        >
          {loading ? 'Loading...' : 'Log in'}
        </Text>
      </Pressable>

      <Link
        href="/signup"
        style={[
          styles.signUp,
          { color: isDark ? '#66C2A4' : '#006B5C' },
        ]}
      >
        Don't have an account? Sign up
      </Link>
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
  headerContainer: {
    marginBottom: 50,
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
  },
  inputWrapper: {
    
  },
  textInput: {
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 10,
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
  signUp: {
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  errorText: {
    color: ERROR_COLOR,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    paddingLeft: 2,
  }
});