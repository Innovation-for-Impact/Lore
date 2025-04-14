import { React, useState, } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Image, Text, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Logo from '../assets/logo-transparent-white.png';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CreateAccountNameScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const goBack = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        if (!firstName || !lastName) {
            setError("All fields are required.");
            return;
        }

        // TODO: API Endpoint

        // Navigate to the next screen - profile picture
        navigation.navigate('CreateAccountProfileScreen');
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={{ position: 'absolute', top: 60, left: 0, zIndex: 10 }} 
                    onPress={goBack}
                >
                    <Ionicons name="arrow-back" size={35} color="white" />
                </TouchableOpacity>
                <View style={styles.container}>
                    <Image source={Logo} style={styles.img}/>
                    <Text style={styles.title}>Let's Get Started</Text>
                    <Text style={styles.text}>what's your name?</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="first name"
                        placeholderTextColor="#555"
                        value={firstName}
                        onChangeText={setFirstName}
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="last name"
                        placeholderTextColor="#555"
                        value={lastName}
                        onChangeText={setLastName}
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleContinue}>
                        <Text style={styles.buttonText}>continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
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
        fontSize: 38, 
        fontWeight: "bold", 
        marginBottom: 10,
        fontFamily: 'Work Sans'
    },
    text: {
        color: "#2E5E76",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 50,
        fontFamily: 'Work Sans'
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
    errorText: {
        color: "red",
        marginBottom: 10,
        fontFamily: 'Work Sans'
    },
    button: {
        backgroundColor: "#5F4078",
        width: screenWidth * 0.9,
        paddingVertical: screenHeight * 0.015,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontFamily: 'Work Sans'
    },
});

export default CreateAccountNameScreen;