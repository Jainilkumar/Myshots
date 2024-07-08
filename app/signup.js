import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ImageBackground, Image, SafeAreaView,Alert } from 'react-native';
import { COLORS, icons, images, FONT, SIZES } from "../constants";
import { Stack, useRouter } from "expo-router";
import styles from "../styles/login.styles.js";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import ApiServer from '../server/server';
import AsyncStorage from '@react-native-async-storage/async-storage';

const signupScreen = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    user: '',
    email: '',
    password: '',
    profile: "/Users/jainilparmar/projects/face-recognition/assets/images/profile.jpg",
    profileBase64: '',
  });
  const saveUsernameToAsyncStorage = async (username) => {
    try {
      await AsyncStorage.setItem('username', username);
    } catch (error) {
      console.error(error);
    }
  };
  const fileToBase64 = async (fileUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setFormState(prevState => ({
        ...prevState,
        imageBase64: base64,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery was denied');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setFormState(prevState => ({
        ...prevState,
        profile: pickerResult.uri,
      }));
      fileToBase64(pickerResult.uri);
    }
  };
  const handleLogin = () => {
    return router.push("/login")
  };

  const handleSignUp = () => {
    handleSubmit()
  };
  const handleChange = (field, text) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: text
    }));
  };

  const handleRequest = async (formState) => {
    try {
      const response = await axios.post(ApiServer('signUp'), { formState });
      console.log(response);
      return router.push("/home")
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'Failed to sign in. Please try again.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  };

  
  

  const handleSubmit = async() => {
    const { name, email, password, user, profile} = formState;

    if (
      name === '' ||
      email === '' ||
      password === '' ||
      user === '' ||
      profile === "/Users/jainilparmar/projects/face-recognition/assets/images/profile.jpg" ||
      profile === ""
    ) {
      Alert.alert(
        'Validation Error',
        'Please fill in all the required fields and select an image',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } else {
      try {
        await handleRequest(formState);
        await saveUsernameToAsyncStorage(formState.user);
      } catch (error) {
        console.error(error);
      }
    }
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
        <TouchableOpacity style={styles.profilePicContainer} onPress={openImagePicker}>
        <Image
          source={{uri :formState.profile}}
          style={styles.profileImage}
        />
      </TouchableOpacity>
          <Text style={styles.welcomeMessage}>Myshots</Text>
          <TextInput
            style={styles.input}
            placeholder="User name"
            placeholderTextColor="#ffffff"
            onChangeText={text => handleChange('user', text)}
            value={formState.user}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#ffffff"
            onChangeText={text => handleChange('name', text)}
            value={formState.name}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ffffff"
            onChangeText={text => handleChange('email', text)}
            value={formState.email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ffffff"
            onChangeText={text => handleChange('password', text)}
            value={formState.password}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.signupText}>
            Already have a account?{' '}
            <Text style={styles.signupLink} onPress={handleLogin}>
              log in
            </Text>
          </Text>
        </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default signupScreen;
