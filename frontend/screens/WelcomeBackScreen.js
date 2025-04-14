import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Replace with your actual logo import
import Logo from "../assets/logo-transparent-white.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const WelcomeBackScreen = () => {
  const navigation = useNavigation();

  // Back arrow logic (if you want the arrow at the top left)
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Navigate to HomeScreen
  const handleContinue = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={35} color="white" />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={Logo} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Welcome Back!</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Connect with friends, run up challenges, & do it for the plot
      </Text>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeBackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AFB0E4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 15,
    zIndex: 10
  },
  logo: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.25,
    marginBottom: 25,
    resizeMode: "contain",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5F4078",
    marginBottom: 20
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#2E5E76",
    textAlign: "center",
    marginBottom: 60,
  },
  continueButton: {
    width: screenWidth * 0.9,
    paddingVertical: screenHeight * 0.015,
    backgroundColor: "#5F4078",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: screenHeight * 0.15,
  },
  continueText: {
    color: "#fff",
    fontSize: 20,
  }
});
