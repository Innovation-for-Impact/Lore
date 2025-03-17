import React, { useContext, useEffect } from "react";
import { Dimensions, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Logo from '../assets/logo-transparent-white.png';
import Ionicons from '@expo/vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LoginScreen = () => {
    const navigation = useNavigation();
    
    const goBackToRegistration = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ position: 'absolute', top: 60, left: 15, zIndex: 10 }} 
                onPress={goBackToRegistration}
            >
                <Ionicons name="arrow-back" size={35} color="white" />
            </TouchableOpacity>
            <Text>This is Login Screen!</Text>
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
});

export default LoginScreen;
