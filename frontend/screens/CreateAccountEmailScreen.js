import { React, useState, } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Image, Text, TextInput, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Logo from '../assets/logo-transparent-white.png';
import * as SecureStore from 'expo-secure-store';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CreateAccountEmailScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const goBack = () => {
        navigation.goBack();
    };

    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // TODO: proper error handling
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        fetch(`${apiUrl}/api/v1/auth/registration/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                password1: password,
                password2: confirmPassword,
            }),
        })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        }).then(res => {
            const token = res.access;
            SecureStore.setItemAsync('jwt_token', token).then(() => {
                navigation.navigate('CreateAccountNameScreen');
            }).catch(err => {
                console.error(`Error while storing token: ${err}`)
            });
        }).catch((error) => {
            console.error('Error:', error);
            setError("Failed to register: " + error.message);
        });

        // TODO: API endpoint to check email
        // if email already exists in database - X mark
        // else check mark

        // Navigate to the next screen - name
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ position: 'absolute', top: 60, left: 15, zIndex: 10 }} 
                onPress={goBack}
            >
                <Ionicons name="arrow-back" size={35} color="white" />
            </TouchableOpacity>
            <View style={styles.container}>
                <Image source={Logo} style={styles.img}/>
                <Text style={styles.title}>Create Account</Text>

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
                        style={styles.eyeIcon}
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
                        style={styles.eyeIcon}
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

            <View style={styles.footerTextContainer}>
                <View style={styles.textRow}>
                    <Text style={styles.linkText}>By creating an account, you agree to our</Text>
                    <TouchableOpacity>
                        <Text style={[styles.linkTextTerms, styles.linkText]}> Terms & Conditions</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        width: screenWidth * 0.7,
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