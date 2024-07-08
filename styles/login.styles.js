import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../constants";

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerTitle: {
      fontFamily: FONT.Tangerine,
      fontSize: 40,
      color: COLORS.primary,
      marginTop: 2,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'contain', 
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 8,
    },
    input: {
      width: '100%',
      height: 50,
      marginBottom: 10,
      padding: 10,
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 5,
    },
    button: {
      width: '100%',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#2196F3",
      borderRadius: 5,
      marginTop: 20,
    },
    buttonText: {
      fontSize: 18,
      color: "#ffffff",
      fontWeight: 'bold'
    },
    signupText: {
      marginTop: 20,
      color: '#ffffff',
      fontSize: 16,
      textAlign: 'center',
    },
    signupLink: {
      color: '#007bff',
    },
    welcomeMessage: {
      fontFamily: FONT.Tangerine,
      fontSize: 45,
      color: "white",
      marginBottom: 20
    },
    profilePicContainer: {
      marginBottom: 20,
      borderRadius: 75,
      overflow: 'hidden',
      borderColor: '#FFFFFF',
      elevation: 5,
    },
    profileImage: {
      width: 150,
      height: 150,
    },
  });


  export default styles;