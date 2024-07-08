import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./welcome.style";
import { icons, SIZES } from "../../../constants";

const Welcome = ({ searchTerm, setSearchTerm, handleClick }) => {
  const router = useRouter();

  return (
    <View>
        <View style={styles.sectionStyle}>
          <Image
            source={icons.search}
            resizeMode='contain'
            style={styles.imageStyle}
          />
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            placeholder='What are you looking for?' 
            onSubmitEditing={handleClick}
          />
        </View>
    </View>
  );
};

export default Welcome;
