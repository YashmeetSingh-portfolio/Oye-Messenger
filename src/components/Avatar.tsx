import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'

interface Props {
  size: number
  url: string | null
  onUpload: (filePath: string) => void
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
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

  async function uploadAvatar() {
    try {
      setUploading(true)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      })
      if (result.canceled || !result.assets?.length) return
      const image = result.assets[0]
      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())
      const fileExt = image.uri.split('.').pop() ?? 'jpg'
      const path = `${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        })

      if (error) throw error
      onUpload(data.path)
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Pressable onPress={uploadAvatar}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={[avatarSize, styles.avatar]}
        />
      ) : (<View style={[avatarSize, styles.avatarDummyContainer]}>
                 <Image
                    source={require("../../assets/images/user.png")}
                    style={[avatarSize, styles.avatar]} />
                 </View>
      )}
    </Pressable>
  )
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
    
    borderRadius: 999,
    borderWidth: 1,
    
  },
})
