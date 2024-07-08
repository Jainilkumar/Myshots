import React, { useState, useEffect } from 'react';
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, ScrollView, Image, StyleSheet,Dimensions,TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import axios from 'axios';
import ApiServer from '../../server/server';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as MediaLibrary from 'expo-media-library';
import ImageGallery from './ImageGallery';
function EventDetails() {
  const router = useRouter();
  const [container, setContainer] = useState({});
  const { id } = useSearchParams();
  const windowWidth = Dimensions.get('window').width;
  const imageHeight = windowWidth * (9 / 16);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [base64Images, setBase64Images] = useState([]);
   

  useEffect(() => {
    requestData(id);
  }, []);
  const convertBase64Image = data => {
    const imageSource = `data:image/jpeg;base64,${data.image}`;
    return { ...data, image: { uri: imageSource } };
  };

  const requestData = name => {
    axios
      .post(ApiServer('eventDetails'), { name })
      .then(response => {
        const data = response.data;
        const convertedData = convertBase64Image(data);
        setContainer(convertedData);
      })
      .catch(error => {
        console.error(error);
        Alert.alert(
          'Error',
          'Failed to connect. Please try again.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      });
  };
  const convertURIToBase64 = async (uri) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  };
  
  const convertUrisToBase64 = async (uris) => {
    const base64Array = [];
    for (const uri of uris) {
      const base64 = await convertURIToBase64(uri);
      base64Array.push(base64);
    }
    return base64Array;
  };
  
  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery was denied');
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });
  
    if (pickerResult.error) {
      alert('An error occurred while picking the image');
      return;
    }
  
    if (!pickerResult.cancelled) {
      const imageArray = pickerResult.assets;
      const uris = imageArray.map(image => image.uri);
      const base64Array = await convertUrisToBase64(uris);
      console.log(base64Array);
      handleRequest(base64Array);
    } else {
      alert('Image picker was cancelled');
    }
  };
  const handleRequest = async (base64) => {
    
    try {
      setLoading(true);
      const eventName = container.name;
      const response = await axios.post(ApiServer('addMedia'), {base64, eventName});
      Alert.alert(
        'Success',
        'successfully Uploaded',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'Failed. Please try again.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
      setLoading(false);
    }
  };

  
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access the media library for saving images.'
      );
    }
  };

  const handleButtonPress = async () => {
    setLoading(true);
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      const response = await axios.post(ApiServer('getImg'), {
        username: storedUsername,
        event_name: container.name,
      });

      const base64Images = response.data["images"]; 
      setBase64Images(base64Images)

  
      setLoading(false); 
    } catch (error) {
      setLoading(false); 
      console.log('Error accessing username from AsyncStorage:', error);
      Alert.alert('Error', 'Failed to download and save images.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "",
        }} 
      />
       <View style={styles.activityIndicatorContainer}>
      <ActivityIndicator animating={loading} size="large" color="#0000ff" />
      </View>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={container.image} style={styles.image(imageHeight)} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.eventName}>{container.name}</Text>
          <Text style={styles.locationText}>{container.address},</Text>
          <Text style={styles.locationText}>{container.city}, {container.country}</Text>
          <View style={styles.line} />
          <Text style={styles.organizerText}>Organized by: {container.organizer}</Text>
          <View style={styles.line} />
          <Text style={styles.descriptionText}>{container.about}</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.upload(windowWidth)} onPress={openImagePicker}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.myshots(windowWidth)} onPress={handleButtonPress}>
              <Text style={styles.buttonText}>My Shots</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
        <View style={styles.line} />
        <Text style={styles.organizerText}>My Images:</Text>
        <ImageGallery base64Images={base64Images} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: (imageHeight) => ({
    width: '100%',
    height: imageHeight,
    aspectRatio: 16 / 9,
  }),
  detailsContainer: {
    padding: 16,
  },
  eventName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 4,
  },
  organizerText: {
    fontSize: 20,
    color: 'black',
    fontWeight:'bold',
  },
  line: {
    marginTop: 16,
    borderBottomColor: '#888888',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upload:(windowWidth)=> ({
    width: windowWidth/2 - 20,
    backgroundColor: "#2196F3",
    padding: 10,
    marginLeft: 10,
    borderRadius: 8,
  }),
  myshots:(windowWidth)=> ({
    width: windowWidth/2 - 20,
    backgroundColor: "#E91E63",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
  }),
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: "center",
    fontWeight: 'bold',
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EventDetails;
