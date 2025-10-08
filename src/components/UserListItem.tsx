import React from 'react'
import { Text, View } from 'react-native'

const UserListItem = ({user}) => {
  return (
    <View style={{padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
      <Text style={{fontWeight: 600}}>{user.full_name}</Text>
    </View>
  )
}

export default UserListItem