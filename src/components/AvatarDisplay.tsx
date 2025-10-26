import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { supabase } from '../lib/supabase';

interface Props {
  size?: number;
  url: string | null;
}

export default function AvatarDisplay({url, size=40}: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarSize = { height: size, width: size, borderRadius: size / 2 }
   useEffect(() => {
    if (url) downloadImage(url)
  }, [url])
  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) throw error
      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => setAvatarUrl(fr.result as string)
    } catch (error) {
      if (error instanceof Error) console.log('Error downloading image: ', error.message)
    }
  }

  return (
    <>
    {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={[avatarSize, styles.avatar]}
            />
          ) : (
            <View style={[avatarSize, styles.avatarDummyContainer]}>
           <Image
              source={require("../../assets/images/user.png")}
              style={[avatarSize, styles.avatar]} />
           </View>
          )}
          </>
      );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#363F3B',
    objectFit: 'cover',
  },
  placeholder: {
    backgroundColor: '#363F3B',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#363F3B',
  },
  avatarDummyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7b7b7bff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#7b7b7bff',
  },
})
