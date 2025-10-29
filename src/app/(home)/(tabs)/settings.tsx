import AvatarDisplay from '@/src/components/AvatarDisplay';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Clipboard,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { SvgXml } from 'react-native-svg';
import { Channel } from 'stream-chat';

function Settings() {
  const MyRectangleSvg = `
<svg width="30" height="3" viewBox="0 0 30 3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="3" rx="1.5" fill="#E6E6E6"/>
</svg>
`;
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<Channel | null>(null);
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullname] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const appLink = 'https://expo.dev/accounts/devyashmeet/projects/OYE/builds/eb14d1df-fcf9-4aff-a70b-f6ec92dd07c1';

  const toggleModal = () => setModalVisible(!isModalVisible);

  const shareToWhatsApp = async () => {
    const url = `whatsapp://send?text=Hey! Check out this awesome app: ${appLink}`;
    await Linking.openURL(url).catch(() =>
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share.')
    );
  };

 const shareToInstagram = async () => {
  const message = `Hey! Check out this awesome app: ${appLink}`;
  const instagramUrl = 'instagram://'; // preferred scheme
  const fallbackUrl = 'https://www.instagram.com/';

  try {
    const canOpen = await Linking.canOpenURL(instagramUrl);
    if (canOpen) {
      await Linking.openURL(instagramUrl);
    } else {
      // fallback to system share if app not detected
      await Share.share({ message, url: fallbackUrl });
    }
  } catch (error) {
    await Share.share({ message, url: fallbackUrl });
  }
};

  const shareToMessages = async () => {
    const message = `Hey! Check out this awesome app: ${appLink}`;
    await Share.share({ message });
  };

  const copyLink = async () => {
    Clipboard.setString(appLink);
    Alert.alert('Copied!', 'App link copied to clipboard.');
  };
  const settings = [
    {
      settingName: 'Account',
      description: 'Change Avatar, Full Name',
      icon: 'user',
      path: '/profile',
    },
    {
      settingName: 'Chat',
      description: 'Chat theme, wallpapers',
      icon: 'message',
      path: '/(home)/WallpaperOverviewScreen',
    },
    // {
    //   settingName: 'Notifications',
    //   description: 'Notification settings',
    //   icon: 'bell',
    //   path: '/commingSoon',
    // },
  ];

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) throw error;

      if (data) {
        setAvatarUrl(data.avatar_url);
        setFullname(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.LowerHalveContainer}>
        <View style={styles.barContainer}>
          <SvgXml xml={MyRectangleSvg} />
        </View>

        <View style={styles.Profile}>
          <View style={{ borderRadius: 22, height: 60, width: 60 }}>
            <AvatarDisplay size={60} url={avatarUrl} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.nameText}>{fullName || 'Your Name'}</Text>
            <Text style={styles.emailText}>{session?.user?.email}</Text>
          </View>
        </View>

        <View style={styles.partition}></View>

        <View style={{ marginTop: 20 }}>
          {settings.map((s, idx) => (
            <TouchableOpacity
              style={styles.setting}
              key={idx}
              onPress={() => router.push(s.path)}
            >
              <View style={styles.settingIcon}>
                <AntDesign name={s.icon as any} size={24} color="#797C7B" />
              </View>
              <View style={styles.settingDetails}>
                <Text style={styles.settingName}>{s.settingName}</Text>
                <Text style={styles.settingDescription}>{s.description}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* ✅ Invite Friend Section */}
          <TouchableOpacity style={styles.setting} onPress={toggleModal}>
            <View style={styles.settingIcon}>
              <AntDesign name={'usergroup-add'} size={24} color="#797C7B" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>Invite a friend</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Share Modal (Bottom Popup) */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Share this app</Text>

          <View style={styles.shareOptions}>
            <TouchableOpacity style={styles.shareButton} onPress={shareToWhatsApp}>
              <FontAwesome name="whatsapp" size={28} color="#25D366" />
              <Text style={styles.shareText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={shareToInstagram}>
              <FontAwesome name="instagram" size={28} color="#E1306C" />
              <Text style={styles.shareText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={shareToMessages}>
              <Feather name="more-horizontal" size={24} color="black" />
              <Text style={styles.shareText}>Other</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={copyLink}>
              <AntDesign name="link" size={28} color="#333" />
              <Text style={styles.shareText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    width: 327,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 61,
    left: 18,
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  LowerHalveContainer: {
    position: 'absolute',
    height: '90%',
    backgroundColor: '#fff',
    width: '100%',
    top: 180,
    left: 0,
    borderRadius: 40,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  barContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  Profile: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
  },
  partition: {
    height: 1,
    backgroundColor: '#F5F6F6',
    width: 375,
    position: 'absolute',
    top: 120,
  },
  userDetails: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000E08',
    marginTop: 7,
    lineHeight: 20,
  },
  emailText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#797C7B',
    lineHeight: 12,
    marginTop: 4,
  },
  setting: {
    flexDirection: 'row',
    height: 44,
    marginTop: 25,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderColor: '#E6E6E6',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F8F7',
  },
  settingDetails: {
    marginLeft: 12,
    marginTop: 6,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000E08',
    lineHeight: 16,
  },
  settingDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#797C7B',
    lineHeight: 12,
    marginTop: 6,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  modalHandle: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000E08',
    textAlign: 'center',
    marginBottom: 20,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareButton: {
    alignItems: 'center',
  },
  shareText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
  },
});

export default Settings;
