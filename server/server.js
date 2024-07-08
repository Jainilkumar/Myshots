import { Platform } from 'react-native';

const ApiServer = (name) => {
    let host
    if (Platform.OS === 'android') {
        host = '10.0.2.2';
      } else if (Platform.OS === 'ios') {
        host = '127.0.0.1';
      } 
      server = "http://"+ host +":5000/api/" + name;
      return server;
}

export default ApiServer;