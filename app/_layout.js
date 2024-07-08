import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();


// export const unstable_settings = {
//   // Ensure any route can link back to `/`
//   initialRouteName: "login",
// };

const Layout = () => {
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
    Tangerine: require("../assets/fonts/Tangerine-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack initialRouteName="login">
      <Stack.Screen options={{headerShown: false}} name="login" />
      <Stack.Screen options={{headerShown: false}} name="signup" />
      <Stack.Screen options={{headerShown: false}} name="(tabs)"/>
    </Stack>
    )
};

export default Layout;
