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
                        placeholder="First Name"
                        placeholderTextColor="#555"
                        value={firstName}
                        onChangeText={setFirstName}
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        placeholderTextColor="#555"
                        value={lastName}
                        onChangeText={setLastName}
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleContinue}>
                        <Text style={styles.buttonText}>Continue</Text>
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
        fontSize: 45, 
        fontWeight: "bold", 
        marginBottom: 10,
    },
    text: {
        color: "#007FBC",
        fontSize: 35,
        fontWeight: "bold",
        marginBottom: 50,
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
        paddingVertical: 16,
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

export default CreateAccountNameScreen;