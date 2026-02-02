import { Feather, Ionicons } from '@expo/vector-icons';
// import * as SecureStore from 'expo-secure-store';
import { useState, } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import Logo from '../assets/logo-transparent-white.png';
import { useNavigation } from '@react-navigation/native';
import { $api, setTokens } from '../types/constants';
import { useUser } from '../context/UserContext';
import { AuthNavigation } from '../navigation/Navigators';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CreateAccountEmailScreen = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<AuthNavigation>();

  const { setUser } = useUser();

  const isEmailValid = email.includes("@") && email.includes(".");

  const { mutateAsync: register } = $api.useMutation(
    "post",
    "/api/v1/auth/registration/",
    {
      onError: (error) => {
        setError(error.password1[0]); // TODO: Get openAPI spec to generate this
      }
    }
  )

  const { mutateAsync: login } = $api.useMutation(
    "post",
    "/api/v1/auth/login/",
    {
      onSuccess: (response) => {
        // redirect to user page
        setUser(response.user);
        setTokens(response.access, response.refresh);
        navigation.navigate('CreateAccountProfileScreen');
      },
      onError: (error) => {
        setError(error.non_field_errors);
      }
    }
  )

  const goBack = () => {
    navigation.goBack();
  };

  const handleRegister = async () => {
    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!isEmailValid) {
      setError("Invalid email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    await register({
      body: {
        email: email,
        password1: password,
        password2: password,
        first_name: first_name,
        last_name: last_name
      }
    })

    await login(
      {
        body: {
          email: email,
          password: password
        }
      }
    );

    // TODO: API endpoint to check email
    // if email already exists in database - X mark
    // else check mark

    // Navigate to the next screen - name
    // navigation.navigate('CreateAccountNameScreen');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 60, left: 15, zIndex: 10 }}
          onPress={goBack}
        >
          <Ionicons name="arrow-back" size={35} color="white" />
        </TouchableOpacity>
        <View style={styles.container}>
          <Image source={Logo} style={styles.img} />
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            style={styles.input}
            placeholder="first name"
            placeholderTextColor="#555"
            value={first_name}
            onChangeText={setFirstName}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="last name"
            placeholderTextColor="#555"
            value={last_name}
            onChangeText={setLastName}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="email address"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputPasswords}
              placeholder="password"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={23} color="grey" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputPasswords}
              placeholder="confirm password"
              placeholderTextColor="#555"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={23} color="grey" />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText} numberOfLines={1}>create account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footerTextContainer}>
        <View style={styles.textRow}>
          <Text style={styles.linkText}>By creating an account, you agree to our</Text>
          <TouchableOpacity>
            <Text style={[styles.linkTextTerms, styles.linkText]}> Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: "#AFB0E4",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  img: {
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  input: {
    width: screenWidth * 0.9,
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
    fontFamily: 'Work Sans'
  },
  inputPasswords: {
    width: screenWidth * 0.78,
    fontSize: 16,
    color: "#333",
    fontFamily: 'Work Sans'
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Work Sans'
  },
  button: {
    backgroundColor: "#5F4078",
    width: screenWidth * 0.9,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFF",
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Work Sans'
  },
  eyePass: {
    position: 'absolute',
    top: screenHeight * 0.563,
    right: 15,
    padding: 5,
  },
  eyeConPass: {
    position: 'absolute',
    top: screenHeight * 0.628,
    right: 15,
    padding: 5,
  },
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerTextContainer: {
    position: 'absolute',
    bottom: 50,
  },
  linkText: {
    color: "#2E5E76",
    fontSize: 15,
    fontFamily: 'Work Sans'
  },
  linkTextTerms: {
    fontWeight: "bold",
    fontFamily: 'Work Sans'
  },
});

export default CreateAccountEmailScreen;
