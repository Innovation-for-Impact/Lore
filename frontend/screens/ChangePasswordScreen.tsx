import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileNavigation } from "../navigation/Navigators";
import { SuccessModal } from "../components/SuccessModal";
import { $api } from "../types/constants";
import { FailureModal } from "../components/FailureModal";

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ProfileNavigation>();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);

  const { mutateAsync: changePassword } = $api.useMutation(
    "post",
    "/api/v1/auth/password/change/",
    {
      onSuccess: () => {
        setModalVisible(true);
      },
      onError: (e) => {
        setError(true)
        console.log(e)
      }
    }
  )

  const handleChangePassword = () => {
    if (newPassword === "" || confirmPassword === "") {
      Alert.alert("password field cannot be blank")
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("passwords do not match!")
      return;
    }
    changePassword({
      body: {
        new_password1: newPassword,
        new_password2: confirmPassword
      },
    })
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={[styles.innerContainer, { paddingTop: insets.top }]}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={30} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>change password</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword1}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowPassword1(!showPassword1)}>
                <Ionicons
                  name={showPassword1 ? "eye-off" : "eye"}
                  size={20}
                  color="#5E4B81"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword2}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
                <Ionicons
                  name={showPassword2 ? "eye-off" : "eye"}
                  size={20}
                  color="#5E4B81"
                />
              </TouchableOpacity>
            </View>

            {/* Action Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
              <Text style={styles.submitButtonText}>update password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <SuccessModal
        visible={modalVisible}
        setVisible={setModalVisible}
        title="password updated!"
        buttonText="return to profile"
        callback={() => navigation.goBack()}
      />
      <FailureModal
        cancelCallback={() => setError(false)}
        title="failed to update password"
        tryAgainCallback={handleChangePassword}
        visible={error} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B2B0E6'
  },
  innerContainer: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    alignItems: 'center',
    marginBottom: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Work Sans'
  },
  formSection: {
    paddingHorizontal: 25,
    marginTop: 20
  },

  label: { color: '#3F3356', fontWeight: '700', fontSize: 14, marginBottom: 5 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Pure white background
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 20,
    // Add a slight shadow for depth on iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  input: {
    flex: 1,
    color: '#333', // Dark text for readability on white
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#5E4B81', // Your requested purple
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Work Sans'
  }
});
