import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Alert,TouchableOpacity } from 'react-native';
import ApiServer from '../../../server/server';
import axios from 'axios';
import { useRouter } from "expo-router";


export default function EventList() {
  const router = useRouter();
  const [containers, setContainers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const containerLimit = 10;

  useEffect(() => {
    loadContainers();
  }, []);

  const loadContainers = () => {
    axios
      .post(ApiServer("home"), {
        page: currentPage,
        limit: containerLimit,
      })
      .then(response => {
        const data = response.data;
        const convertedData = convertBase64Images(data);
        setContainers(prevContainers => [...prevContainers, ...convertedData]);
        setCurrentPage(prevPage => prevPage + 1);
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

  const convertBase64Images = data => {
    return data.map(container => {
      const imageSource = `data:image/jpeg;base64,${container.image}`;
      return { ...container, image: { uri: imageSource } };
    });
  };

  const handleScroll = event => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isScrolledToBottom) {
      loadContainers();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {containers.map((container, index) => (
          <TouchableOpacity
             key={index}
             style={styles.itemContainer}
             onPress={() => router.push(`/event-details/${container.name}`)}
          >
            <View style={styles.imageContainer} >
              <View style={styles.imagePadding}>
                <Image source={container.image} style={styles.image} />
              </View>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.eventName}>{container.name}</Text>
              <Text style={styles.locationText}>{container.address}</Text>
              <Text style={styles.locationText}>{container.city}, {container.country}</Text>
              <Text style={styles.organizerText}>Organized by: {container.organizer}</Text>
            </View>
            </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F7F7F7',
  },
  itemContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imagePadding: {
    paddingTop: 20,
  },
  image: {
    width: '100%',
    height: 200,
    aspectRatio: 16 / 9,
  },
  detailsContainer: {
    padding: 16,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  organizerText: {
    fontSize: 14,
    color: '#888888',
    marginTop: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#555555',
    marginTop: 8,
  },
});
