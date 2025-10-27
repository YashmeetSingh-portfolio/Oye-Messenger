// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-router', () => ({
  Slot: 'Slot',
  Redirect: ({ href }) => `Redirect to ${href}`,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: ({ children, ...props }) => children,
  },
  Link: ({ children, ...props }) => children,
}));

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        supabaseUrl: 'https://test.supabase.co',
        supabaseAnonKey: 'test-key',
      },
    },
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }) => children,
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      OS: 'ios',
      select: jest.fn(),
    },
    PermissionsAndroid: {
      requestMultiple: jest.fn(() => Promise.resolve({})),
    },
    Alert: {
      alert: jest.fn(),
    },
    AppState: {
      addEventListener: jest.fn(),
    },
  };
});

// Mock Supabase
jest.mock('./src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      setSession: jest.fn(),
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
    },
    from: jest.fn(() => ({
      upsert: jest.fn(),
      select: jest.fn(),
      eq: jest.fn(),
      single: jest.fn(),
    })),
    functions: {
      invoke: jest.fn(),
    },
  },
}));

// Mock Firebase
jest.mock('@react-native-firebase/messaging', () => ({
  default: () => ({
    setBackgroundMessageHandler: jest.fn(),
    onMessage: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(1)),
    getToken: jest.fn(() => Promise.resolve('mock-token')),
  }),
}));

// Mock Notifee
jest.mock('@notifee/react-native', () => ({
  default: {
    createChannel: jest.fn(() => Promise.resolve('mock-channel-id')),
    displayNotification: jest.fn(),
    onForegroundEvent: jest.fn(),
    onBackgroundEvent: jest.fn(),
  },
}));

// Mock Stream Chat
jest.mock('stream-chat', () => ({
  StreamChat: {
    getInstance: jest.fn(() => ({
      connectUser: jest.fn(),
      disconnectUser: jest.fn(),
      getMessage: jest.fn(() => Promise.resolve({
        message: {
          text: 'Test message',
          user: { name: 'Test User' }
        }
      })),
    })),
  },
}));

// Mock Stream Video SDK
jest.mock('@stream-io/video-react-native-sdk', () => ({
  StreamVideo: jest.fn(),
  StreamVideoClient: jest.fn(),
  firebaseDataHandler: jest.fn(),
  isFirebaseStreamVideoMessage: jest.fn(() => false),
}));

// Mock Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    State: {},
    Directions: {},
  };
});

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  FontAwesome6: 'FontAwesome6',
}));

// Global test environment setup
global.__DEV__ = true;

// Set environment variables for tests
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
process.env.EXPO_PUBLIC_STREAM_API_KEY = 'test-stream-key';