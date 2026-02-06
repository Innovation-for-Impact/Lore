import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Logo from '../assets/logo-transparent-white.png';
import { AuthNavigation } from '../navigation/Navigators';
import { setTokens } from '../types/constants';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const RegistrationScreen = () => {
  const navigation = useNavigation<AuthNavigation>();

  // Check if user is already logged in
  // useEffect(() => {
  //   const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  //   let stale = false;
  //   SecureStore.getItemAsync('jwt_token').then((token) => {
  //     fetch(`${apiUrl}/api/v1/auth/token/verify/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         token: token,
  //       }),
  //     })
  //       .then((res) => {
  //         if (!res.ok) {
  //           throw new Error('Not logged in.');
  //         }
  //
  //         if (!stale) {
  //           navigation.navigate("WelcomeBack");
  //         }
  //       })
  //     // .catch((err) => {
  //     //   console.log(err);
  //     // });
  //   });
  //   return () => {
  //     stale = true;
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What&apos;s Your</Text>
      <Image source={Logo} style={styles.img} />
      <Text style={styles.text}>
        Connect with friends, run up challenges, & do it for the plot
      </Text>
      <TouchableOpacity style={styles.login} onPress={() => {
        setTokens(null, null)
        navigation.navigate('LoginScreen')
      }}>
        <Text style={styles.buttonText}>log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.register} onPress={() => {
        navigation.navigate('CreateAccountEmailScreen')
      }}>
        <Text style={styles.buttonText} numberOfLines={1}>
          create account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#AFB0E4',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#5F4078',
    fontSize: 48,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'Work Sans',
  },
  text: {
    color: '#2E5E76',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 45,
    marginRight: 45,
    textAlign: 'center',
    fontFamily: 'Work Sans',
  },
  img: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.25,
    marginBottom: 25,
  },
  login: {
    backgroundColor: '#5F4078',
    marginTop: screenHeight * 0.15,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.85,
    paddingVertical: screenHeight * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  register: {
    backgroundColor: '#9680B6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.85,
    paddingVertical: screenHeight * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFF',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Work Sans',
  },
});

export default RegistrationScreen;
