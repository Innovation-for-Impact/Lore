import { React, useState, } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Image, Text, TextInput, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Logo from '../assets/logo-transparent-white.png';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const NameScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        // TODO: API Endpoint

        // Navigate to the next screen - name
        navigation.navigate('NameScreen');
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
                    placeholder="Email"
                    placeholderTextColor="#555"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#555"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#555"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
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
    img: {
        width: screenWidth * 0.6,
        height: screenWidth * 0.25,
        marginBottom: 25,
    },
    title: { 
        color: "#5F4078",
        fontSize: 45, 
        fontWeight: "bold", 
        marginBottom: 30 
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
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#5F4078",
        width: screenWidth * 0.9,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "500",
    },
});

export default NameScreen;