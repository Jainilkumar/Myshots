import React from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions,Text } from 'react-native';



const ImageGallery = ({ base64Images }) => {
  const windowWidth = Dimensions.get('window').width;
  const imageHeight = windowWidth * (9 / 16);
  const Base64Image = ({ base64Data }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: `data:image/jpeg;base64,${base64Data}` }} style={styles.image(imageHeight)} />
      </View>
    );
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {base64Images.map((base64Image, index) => (
        <Base64Image key={index} base64Data={base64Image} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  imageContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  image: (imageHeight) => ({
    width: '100%',
    height: imageHeight,
    aspectRatio: 16 / 9,
  }),
});

export default ImageGallery;
