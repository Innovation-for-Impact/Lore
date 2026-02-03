import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { $api, setTokens } from '../types/constants';

// Replace with your actual logo import
import Logo from "../assets/logo-transparent-white.png";
import { useUser } from '../context/UserContext';
import { AuthNavigation } from '../navigation/Navigators';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const LoginScreen = () => {
  const { setUser } = useUser();
  const navigation = useNavigation<AuthNavigation>();

  // State for email/password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Simple validation check for demonstration
  const isEmailValid = email.includes("@") && email.includes(".");

  // Toggle for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [error, setError] = useState("");

  const goBackToRegistration = () => {
    navigation.goBack();
  };

  const { mutateAsync: login } = $api.useMutation(
    "post",
    "/api/v1/auth/login/",
    {
      onSuccess: async (response) => {
        // redirect to user page
        await setTokens(response.access, response.refresh);
        setUser(response.user);
      },
      onError: async (error) => {
        console.log(error)
        await setTokens(null, null);
        setError(error.non_field_errors);
      }
    }
  )

  const handleLogin = async () => {
    if (!isEmailValid) {
      // Set error message for email
      setError("Email is invalid!");
      return;
    }
    // validate input fields
    await login(
      {
        body: {
          email: email,
          password: password
        }
      }
    );
  };

  const handleForgotPassword = () => {
    // Navigate or handle forgot password logic
    navigation.navigate("ForgotPasswordScreen");
  };

  const handleSignUp = () => {
    navigation.navigate('CreateAccountEmailScreen')
  };

  return (
    <View style={{ flex: 1 }} >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={async () => {
            await login(
              {
                body: {
                  email: "test@test.com",
                  password: "test123test123"
                }
              }
            );
          }}>
            <Text> DEBUG LOG IN </Text>
          </TouchableOpacity>
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
              placeholder="email address"
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
              placeholder="password"
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
      </KeyboardAvoidingView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: -10,
    fontFamily: 'Work Sans'
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
    marginBottom: 30,
    fontFamily: 'Work Sans'
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
    fontFamily: 'Work Sans'
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
    fontFamily: 'Work Sans'
  },
  loginButton: {
    width: screenWidth * 0.9,
    paddingVertical: screenHeight * 0.014,
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
    fontFamily: 'Work Sans'
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  signUpText: {
    color: "#2E5E76",
    fontSize: 16,
    fontFamily: 'Work Sans'
  },
  signUpLink: {
    color: "#2E5E76",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 16,
    fontFamily: 'Work Sans'
  }
});

export default LoginScreen;


