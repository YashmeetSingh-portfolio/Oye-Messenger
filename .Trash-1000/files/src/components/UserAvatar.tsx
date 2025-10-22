import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { supabase } from '../lib/supabase';

interface Props {
  size: number;
  url: string | null | undefined; // Added undefined for safety
}

export default function UserAvatar({ url, size = 50 }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) {
      downloadImage(url);
    } else {
      setAvatarUrl(null); // Clear if URL is missing
    }
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image for list item: ', error.message);
      }
      setAvatarUrl(null); // Ensure no broken state on error
    }
  }

  return (
    <View style={avatarSize}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="User Avatar"
          style={[avatarSize, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.noImage]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    objectFit: 'cover',
    borderRadius: 25, // For a nice circular avatar
  },
  noImage: {
    backgroundColor: '#ccc',
    borderRadius: 25,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});