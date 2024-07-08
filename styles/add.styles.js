import { StyleSheet } from "react-native";
import { FONT} from "../constants";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 30,
      backgroundColor: '#fff',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    label: {
      fontFamily: FONT.Tangerine,
      fontSize: 35,
      color: "black",
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
    },
    multilineInput: {
      flex: 1,
      height: 100,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      textAlignVertical: 'top',
    },
    margin: {
      marginLeft: 30,
    },
    heading: {
      fontFamily: FONT.Tangerine,
      fontSize: 40,
      color: "black",
    },
    SubmitEvent: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
        position: 'relative',
        backgroundColor: "#E91E63",
        color: "#E91E63",
    },
   
  });

export default styles;