import React, { useState } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from '@expo/vector-icons/Feather';

// Replace with your actual logo import
import Logo from "../assets/logo-transparent-white.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const LoginScreen = () => {
  const navigation = useNavigation();

  // State for email/password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Simple validation check for demonstration
  const isEmailValid = email.includes("@") && email.includes(".");

  // Toggle for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const goBackToRegistration = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    // Check credentials (hard-coded for example)
    if (email === "admin@lore.com" && password === "testpassword") {
      // Navigate to WelcomeBack screen if valid
      navigation.navigate("WelcomeBack");
    } else {
      // Show alert or error message if invalid
      Alert.alert("Invalid Credentials", "Please check your email or password.");
    }
  };

  const handleForgotPassword = () => {
    // Navigate or handle forgot password logic
    navigation.navigate("ForgotPasswordScreen");
  };

  const handleSignUp = () => {
    // Navigate to your Sign Up screen
    navigation.navigate("CreateAccountScreen");
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={goBackToRegistration}
      >
        <Ionicons name="arrow-back" size={35} color="white" />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={Logo} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Log In</Text>

      {/* Email Input + Validation Icon */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {email.length > 0 && (
          <Ionicons
            name={isEmailValid ? "checkmark-circle" : "close-circle"}
            size={24}
            color={isEmailValid ? "green" : "red"}
            style={styles.inputIcon}
          />
        )}
      </View>

      {/* Password Input + Show/Hide Icon */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={!isPasswordVisible} 
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.inputIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Feather name={isPasswordVisible ? 'eye' : 'eye-off'} size={23} color="grey" />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>log in</Text>
      </TouchableOpacity>

      {/* Sign Up Footer */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { 
    position: 'relative',
    backgroundColor: "#AFB0E4",
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
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
  },
  title: { 
    color: "#5F4078",
    fontSize: 40, 
    fontWeight: "bold", 
    marginBottom: 30 
  },
  inputContainer: {
    width: screenWidth * 0.9,
    marginBottom: 15,
    position: "relative"
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#333",
  },
  inputIcon: {
    position: "absolute",
    right: 15,
    top: 13
  },
  forgotPassword: {
    color: "#2E5E76",
    textDecorationLine: "underline",
    marginBottom: 40,
    fontSize: 14,
    marginLeft: screenWidth * 0.62,
  },
  loginButton: {
    width: screenWidth * 0.9,
    paddingVertical: screenHeight * 0.015,
    height: 50,
    backgroundColor: "#5F4078",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  signUpText: {
    color: "#2E5E76",
    fontSize: 16,
  },
  signUpLink: {
    color: "#2E5E76",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 16,
  }
});

export default LoginScreen;


