import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#0A1832","#43116A", "#191926"]} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

       

        <View style={styles.textContainer}>
          <Text style={styles.heading}>
            <Text style={styles.headingRegular}>Connect{"\n"}friends{"\n"}</Text>easily &{"\n"}quickly
          </Text>

          <Text style={styles.subText}>
            Our chat app is the perfect way to stay connected with friends and family.
          </Text>
        </View>

        <Pressable style={styles.signUpButton} onPress={() => router.push("/signup")}>
          <Text style={styles.signUpText}>Sign up with mail</Text>
        </Pressable>

        <Text style={styles.loginText}>
          Existing account?{" "}
          <Text style={styles.loginLink} onPress={() => router.push("/login")}>
            Log in
          </Text>
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  logo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
  },
  textContainer: {
    position: "absolute",
    top: 154,
    left: 19,
    alignItems: "flex-start",
   
    width: 338,
    height: 372,
  
    



  },
  heading: {
    color: "#fff",
    fontSize: 68,
    fontWeight: "700",
    
    lineHeight: 78,
    marginBottom: 20,
  },
  headingRegular:{
    fontWeight: "400",
    lineHeight: 78,

  },
  subText: {
    color: "#c4c4c4",
    fontSize: 15,
    
    maxWidth: 300,
  },
  signUpButton: {
    width:317,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 50,
    alignItems: "center",
    height: 48,
    marginTop: 40,
    position: "absolute",
    top:564,
    left:18,
    justifyContent: "center",
  },
  signUpText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    color: "#c4c4c4",
    fontSize: 14,
    marginBottom: 20,
      position: "absolute",
    top:700,
    left:100,
  },
  loginLink: {
    color: "#fff",
    fontWeight: "600",
  
  },
});
