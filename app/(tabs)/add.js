import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert } from 'react-native';
import styles from "../../styles/add.styles";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import ApiServer from '../../server/server';
import { useRouter } from 'expo-router';


const AddEvent = ({ navigation }) => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    about: '',
    organizer: '',
    imageUri: null,
    imageBase64: '',
  });

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
        imageUri: pickerResult.uri,
      }));
      fileToBase64(pickerResult.uri);
    }
  };

  const handleChange = (field, text) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: text
    }));
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

  const handleRequest = async (formState) => {
    try {
      const response = await axios.post(ApiServer('addEvent'), { formState });
      console.log(response);
      Alert.alert(
        'Success',
        'Event successfully Created',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
      setFormState("");
      router.push("/home");
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'Failed to create the event. Please try again.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  };

  
  

  const handleSubmit = () => {
    const { name, address, city, country, about, organizer, imageUri } = formState;

    if (
      name === '' ||
      address === '' ||
      city === '' ||
      country === '' ||
      about === '' ||
      organizer === '' ||
      imageUri === null
    ) {
      Alert.alert(
        'Validation Error',
        'Please fill in all the required fields and select an image',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } else {
      handleRequest(formState);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={formState.name}
          onChangeText={text => handleChange('name', text)}
          placeholder="Event name"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={formState.organizer}
          onChangeText={text => handleChange('organizer', text)}
          placeholder="Enter event organizer name"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={formState.address}
          onChangeText={text => handleChange('address', text)}
          placeholder="Enter event address"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={formState.city}
          onChangeText={text => handleChange('city', text)}
          placeholder="City"
        />
        <TextInput
          style={[styles.input, styles.margin]}
          value={formState.country}
          onChangeText={text => handleChange('country', text)}
          placeholder="Country"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>About:</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.multilineInput}
          value={formState.about}
          onChangeText={text => handleChange('about', text)}
          placeholder="Tell us about the event"
          multiline
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button title="Upload image" onPress={openImagePicker} />
        <View style={{ paddingLeft: 20, paddingRight: 40, paddingTop: 30 }}>
          {formState.imageUri && (
            <Image
              source={{ uri: formState.imageUri }}
              style={{ width: 300, height: 168.75, resizeMode: 'stretch' }}
            />
          )}
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Button title="Submit" onPress={handleSubmit} color="#E91E63" />
      </View>
    </View>
  );
};

export default AddEvent;