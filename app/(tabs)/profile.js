import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, icons, images, SIZES } from "../../constants";

const ProfilePage = () => {
  const router = useRouter();
  const handleEditProfile = async() => {
    try {
      await AsyncStorage.removeItem('username');
      // Redirect to the login page
      return router.push("/login");
    } catch (error) {
      console.log('Error signing out:', error);
      // Handle error
    }
  };


  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('username');
      // Redirect to the login page
      return router.push("/login");
    } catch (error) {
      console.log('Error signing out:', error);
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profilePicContainer}>
        <Image
          source={images.profile}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.name}></Text>
        <Text style={styles.username}></Text>
        <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  profilePicContainer: {
    marginBottom: 20,
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    elevation: 5,
  },
  profileImage: {
    width: 150,
    height: 150,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  username: {
    fontSize: 18,
    marginBottom: 15,
    color: '#666666',
  },
  editProfileButton: {
    backgroundColor: "#E91E63",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePage;
