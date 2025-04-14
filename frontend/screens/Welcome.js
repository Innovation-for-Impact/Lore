import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Logo from '../assets/logo-transparent-white.png';
import Ionicons from "@expo/vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Welcome = ({ navigation }) => {
  // Back arrow logic (if you want the arrow at the top left)
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={35} color="white" />
      </TouchableOpacity>

      <Image source={Logo} style={styles.img} />

      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}> 
        Connect with friends, run up challenges, & do it for the plot
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.buttonText}>continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFB0E4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 15,
    zIndex: 10
  },
  img: {
    width: width * 0.6, // larger logo size
    height: width * 0.25,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 40, // bigger text
    fontWeight: 'bold',
    color: '#5D3B73',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22, // larger subtitle
    color: '#2E5E76',
    textAlign: 'center',
    marginBottom: 60,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#5D3B73',
    width: screenWidth * 0.9,
    paddingVertical: screenHeight * 0.015,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: '100%',
    alignItems: 'center',   // centers the text inside
    justifyContent: 'center', // vertical alignment
    marginTop: screenHeight * 0.15,
  },

  buttonText: {
    color: 'white',
    fontSize: 20, // larger button text
  },
});
