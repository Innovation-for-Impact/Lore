import React, { useContext, useEffect } from "react";
import { Dimensions, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Logo from '../assets/logo-transparent-white.png';
import { fontStyle } from '../styles/global';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const RegistrationScreen = () => {
    const navigation = useNavigation();

    const navigateToLogin = () => {
        navigation.navigate('LoginScreen');
    };
    const navigateToCreate = () => {
        navigation.navigate('CreateAccountScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What's Your</Text>
            <Image source={Logo} style={styles.img}/>
            <Text style={styles.text}>Connect with friends, run up challenges, & do it for the plot</Text>
            <TouchableOpacity style={styles.login} onPress={navigateToLogin}>
                <Text style={styles.buttonText}>log in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.register} onPress={navigateToCreate}>
                <Text style={styles.buttonText } numberOfLines={1}>create account</Text>
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
        fontSize: 48, 
        fontWeight: "bold", 
        marginBottom: 20,
        fontFamily: 'Work Sans',
    },
    text: {
        color: "#2E5E76",
        fontSize: 22, 
        fontWeight: "bold",
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
        marginTop: screenHeight * 0.15,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: screenHeight * 0.015,
        paddingHorizontal: screenWidth * 0.36,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    register: {
        backgroundColor: "#9680B6",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: screenHeight * 0.015,
        paddingHorizontal: screenWidth * 0.26,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        color: "#FFFF",
        fontSize: 20,
        textAlign: 'center',
    }
});

export default RegistrationScreen;
