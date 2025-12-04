import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Logo from '../assets/logo-transparent-white.png';
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, IOS_CLIENT_ID } from '../components/config';
import { Navigation } from "../types/navigation";

WebBrowser.maybeCompleteAuthSession();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CreateAccountScreen = () => {
  const navigation = useNavigation<Navigation>();
  console.log(EXPO_CLIENT_ID)
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // console.log("Google Access Token:", authentication.accessToken);

      // Optional: Fetch user info from Google
      fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication?.accessToken}` }
      })
        .then(res => res.json())
        .then(data => {
          console.log("User Info:", data);
          // Navigate or store user info
        });
    }
  }, [response]);

  const goBackToRegistration = () => {
    navigation.goBack();
  };

  const goToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  const goToEmail = () => {
    navigation.navigate("CreateAccountEmailScreen");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 60, left: 15, zIndex: 10 }} 
        onPress={goBackToRegistration}
      >
        <Ionicons name="arrow-back" size={35} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>What&apos;s Your</Text>
      <Image source={Logo} style={styles.img}/>
      <Text style={styles.text}>Connect with friends, run up challenges, & do it for the plot</Text>

      <TouchableOpacity 
        style={styles.button1}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <View style={styles.buttonTextRow}>
          <AntDesign name="google" size={24} color="white" />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2}>
        <View style={styles.buttonTextRow}>
          <AntDesign name="apple" size={24} color="white" />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button3} onPress={goToEmail}>
        <View style={styles.buttonTextRow}> 
          <MaterialIcons name="email" size={24} color="white" />
          <Text style={styles.buttonText}>Continue with Email</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.footerTextContainer}>
        <View style={styles.textRow}>
          <Text style={styles.linkText}>Already have an account?</Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={[styles.linkTextLogin, styles.linkText]}> Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "#AFB0E4",
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerTextContainer: {
    position: 'absolute',  
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: "#2E5E76",
    fontSize: 16,
    fontFamily: 'Work Sans'
  },
  linkTextLogin: {
    fontWeight: "bold",
    fontFamily: 'Work Sans'
  },
  buttonTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { 
    color: "#5F4078",
    fontSize: 48, 
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: 'Work Sans'
  },
  text: {
    color: "#2E5E76",
    fontSize: 22, 
    fontWeight: "bold",
    marginLeft: 45,
    marginRight: 45,
    textAlign: 'center',
    fontFamily: 'Work Sans'
  },
  img: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.25,
    marginBottom: 25,
  },
  button1: {
    backgroundColor: "#5F4078",
    marginTop: 70,
    marginBottom: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button2: {
    backgroundColor: "#5F4078",
    borderRadius: 50,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.21,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button3: {
    backgroundColor: "#5F4078",
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.21,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFF",
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Work Sans'
  }
});

export default CreateAccountScreen;
