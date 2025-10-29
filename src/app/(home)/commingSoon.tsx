import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

function commingSoon () {
    const colorScheme = useColorScheme();
  return (
    <View style={colorScheme === 'dark' ? {flex:1,backgroundColor:'black', alignItems:'center', justifyContent:'center'} : {flex:1,backgroundColor:'white', alignItems:'center',justifyContent:'center'}}>
         <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={34} color={colorScheme === 'dark' ? 'white' : 'black'} />

          </TouchableOpacity>
          <Text style={colorScheme === 'dark' ? {color:'white', fontSize:24}: {color:'black',fontSize:24}}>Comming Soon!</Text>
      
    </View>
  )
}

const styles = StyleSheet.create({
 backButton: {
    width: 40,
  },

})
export default commingSoon