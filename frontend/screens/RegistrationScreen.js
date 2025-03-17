import React, { useContext, useEffect } from "react";
import { Dimensions, View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import Logo from '../assets/logo-transparent-white.png';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const RegistrationScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
        <Text style={styles.title}>What's Your</Text>
        <Image source={Logo} style={styles.img}/>
        <Text style={styles.text}>Connect with friends, run up challenges, & do it for the plot</Text>
        <TouchableOpacity style={styles.login} nPress={() => navigation.navigate("Login")}>
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.register} nPress={() => navigation.navigate("Register")}>
            <Text style={styles.buttonText } numberOfLines={1}>Create Account</Text>
        </TouchableOpacity>
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
    title: { 
        color: "#5F4078",
        fontSize: 50, 
        fontWeight: "bold", 
        marginBottom: 20 
    },
    text: {
        color: "#007FBC",
        fontSize: 22, 
        fontWeight: "400",
        marginLeft: 45,
        marginRight: 45,
        textAlign: 'center',
    },
    img: {
        width: screenWidth * 0.6,
        height: screenWidth * 0.25,
        marginBottom: 25,
    },
    login: {
        backgroundColor: "#5F4078",
        marginTop: 150,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: screenHeight * 0.015,
        paddingHorizontal: screenWidth * 0.35,
    },
    register: {
        backgroundColor: "#9680B6",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: screenHeight * 0.015,
        paddingHorizontal: screenWidth * 0.25,
    },
    buttonText: {
        color: "#FFFF",
        fontSize: 22,
        textAlign: 'center', 
    }
});

export default RegistrationScreen;
