import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Replace with your actual logo import
import Logo from "../assets/logo-transparent-white.png";

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
        <Text style={styles.continueText}>Continue</Text>
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
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 40,
    lineHeight: 22
  },
  continueButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#645CAA",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  }
});
