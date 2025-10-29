# OYE - Real-time Chat & Video Calling App 💬

A modern, feature-rich messaging application built with React Native and Expo, offering seamless real-time chat, video calling, and push notifications.

## ✨ Features

- **Real-time Messaging** - Instant chat powered by Stream Chat API
- **Video & Voice Calls** - High-quality calls with Stream Video SDK
- **Push Notifications** - Firebase Cloud Messaging (FCM) integration
- **User Authentication** - Secure auth with Supabase
- **Media Sharing** - Share images, videos, and documents
- **User Profiles** - Customizable avatars and profile management
- **Cross-platform** - Works on iOS, Android, and Web

## 🛠 Tech Stack

- **Frontend**: React Native, Expo SDK 54
- **Chat & Video**: Stream Chat & Video APIs
- **Backend**: Supabase (Authentication, Database, Storage)
- **Push Notifications**: Firebase Cloud Messaging
- **Navigation**: Expo Router with file-based routing
- **State Management**: React Context API
- **Storage**: AsyncStorage, MMKV for performance

## 📱 Screenshots

*Add your app screenshots here*

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd oye
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_STREAM_API_KEY=your_stream_api_key
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Configure Firebase**
   - Add your `google-services.json` file to the root directory
   - Configure FCM in your Firebase console

5. **Start the development server**
   ```bash
   npm start
   ```

### Running on Different Platforms

- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## 🏗 Project Structure

```
src/
├── app/                    # File-based routing
│   ├── (auth)/            # Authentication screens
│   └── (home)/            # Main app screens
├── components/            # Reusable UI components
├── providers/             # Context providers
│   ├── AuthProvider.tsx   # Authentication context
│   ├── ChatProvider.tsx   # Stream Chat setup
│   └── NotificationsProvider.tsx
├── lib/                   # External service configurations
│   └── supabase.ts       # Supabase client
└── utils/                 # Utility functions
```

## 🔧 Configuration

### Stream Chat Setup
1. Create a Stream account at [getstream.io](https://getstream.io)
2. Get your API key and add it to your `.env` file
3. Configure user tokens in your backend

### Supabase Setup
1. Create a Supabase project
2. Set up authentication providers
3. Create necessary database tables for user profiles
4. Configure storage buckets for avatars and media

### Firebase Setup
1. Create a Firebase project
2. Enable Cloud Messaging
3. Download and add `google-services.json`
4. Configure push notification permissions

## 📋 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## 🧪 Testing

The project includes comprehensive testing setup with Jest and React Native Testing Library:

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

## 📦 Building for Production

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_STREAM_API_KEY` | Stream Chat API key |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stream](https://getstream.io) for chat and video APIs
- [Supabase](https://supabase.com) for backend services
- [Expo](https://expo.dev) for the amazing development platform
- [Firebase](https://firebase.google.com) for push notifications

## 📞 Support

If you have any questions or need help, please open an issue or contact the development team.

---

Made with ❤️ using React Native and Expo
