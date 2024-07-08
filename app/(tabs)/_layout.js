import { Tabs } from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import styles from "../../components/home/welcome/welcome.style";
import {ScreenHeaderBtn} from "../../components";
import { COLORS, icons, images, SIZES } from "../../constants";
const screenOptions = {
    tabBarShowLabel: false,
    tabBarHiddenOnKeyboard: true,
    headerShown: false,
    tabBarStyle:{
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
    }
  }
export default () => {
    return <Tabs>
        <Tabs.Screen name="home" options={{
          headerShadowVisible: false,
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.settings} dimension='60%' />
          ),
          headerLeft: () => (
            <Text style={styles.welcomeMessage }>Myshots</Text>
          ),
          headerTitle: "",
          tabBarIcon : ({focused}) => {
            return <Ionicons name={focused? "home": "home-outline"}
            size={24}
            color={focused ? "#E91E63":"#C1C0C8"}
            />
          }
        }}/>
        <Tabs.Screen name="add" options={{  
          headerShadowVisible: false,
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.settings} dimension='60%' />
          ),
          headerLeft: () => (
            <Text style={styles.welcomeMessage }>Event Details</Text>
          ),
          headerTitle: "",
          tabBarIcon : ({focused}) => {
            return <Ionicons name={focused? "add-circle": "add-circle-outline"}
            size={24}
            color={focused ? "#E91E63":"#C1C0C8"}
            />
          }
        }}/>
        <Tabs.Screen name="profile" options={{
          headerShadowVisible: false,
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.settings} dimension='60%' />
          ),
          headerLeft: () => (
            <Text style={styles.welcomeMessage }>Profile</Text>
          ),
          headerTitle: "",
          tabBarIcon : ({focused}) => {
            return <Ionicons name={focused? "person": "person-outline"}
            size={24}
            color={focused ? "#E91E63":"#C1C0C8"}
            />
          }
        }}/>
    </Tabs>
}