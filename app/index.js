import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    checkUsername();
  }, []);

  const checkUsername = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      console.log(username);
      if (username) {
        // Username exists, set redirect to home screen
        setRedirectTo("/home");
      } else {
        // Username does not exist, set redirect to login screen
        setRedirectTo("/login");
      }
    } catch (error) {
      console.log("Error checking username:", error);
      // Redirect to login screen in case of an error
      setRedirectTo("/login");
    }
  };

  if (redirectTo) {
    return <Redirect href={redirectTo} />;
  }

  return null; // or any loading state/component
}
