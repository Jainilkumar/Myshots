import { useState } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { COLORS, icons, images, SIZES } from "../../constants";
import {
  Welcome,
  ScreenHeaderBtn,
  EventList
} from "../../components"
import styles from "../../components/home/welcome/welcome.style";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const retrieveUsernameFromAsyncStorage = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      console.log('Username:', username);
      return username;
    } catch (error) {
      console.error(error);
    }
  };
  retrieveUsernameFromAsyncStorage();

  return (
    <SafeAreaView style={{ flex: 1}}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.settings} dimension='60%' />
          ),
          headerLeft: () => (
            <Text style={styles.welcomeMessage }>Myshots</Text>
          ),
          headerTitle: "",
        }}
      />

    <Welcome 
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleClick={() => {
        if (searchTerm) {
          router.push(`/search/${searchTerm}`)
        }
      }}
    />
    <EventList></EventList>

    </SafeAreaView>
  );
};

export default Home;
