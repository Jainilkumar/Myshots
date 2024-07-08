import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ImageBackground, Image, SafeAreaView,Dimensions } from 'react-native';
import { COLORS, icons, images, FONT, SIZES } from "../constants";
import { Stack, useRouter } from "expo-router";
import styles from "../styles/login.styles.js";
const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleLogin = () => {
    return router.push("(tabs)/home")
  };

  const handleSignUp = () => {
    return router.push("/signup")
  };

  return (
    <ImageBackground
    source={images.loginBackgroundImg}
    style={styles.backgroundImage}
  >
    <SafeAreaView style={styles.container}>
    <Stack.Screen
        options={{
          headerLeft: () => (
            <Text style={styles.headerTitle}>Myshots</Text>
          ),
          headerTitle: "",
        }}
      />
        <View style={styles.content}>
          <Image
            source={icons.icon}
            style={styles.logo}
          />
          <Text style={styles.welcomeMessage}>Myshots</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ffffff"
            onChangeText={text => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ffffff"
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <Text style={styles.signupLink} onPress={handleSignUp}>
              Sign up
            </Text>
          </Text>
        </View>
    </SafeAreaView>
    </ImageBackground>
  );
};


export default LoginScreen;
