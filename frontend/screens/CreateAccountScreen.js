import React, { useContext, useEffect } from "react";
import { Dimensions, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Logo from '../assets/logo-transparent-white.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CreateAccountScreen = () => {
    const navigation = useNavigation();

    const goBackToRegistration = () => {
        navigation.goBack();
    };

    const goToLogin = () => {
        navigation.navigate("LoginScreen");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ position: 'absolute', top: 60, left: 15, zIndex: 10 }} 
                onPress={goBackToRegistration}
            >
                <Ionicons name="arrow-back" size={35} color="white" />
            </TouchableOpacity>
            <View style={styles.container}>
                <Text style={styles.title}>What's Your</Text>
                <Image source={Logo} style={styles.img}/>
                <Text style={styles.text}>Connect with friends, run up challenges, & do it for the plot</Text>

                <TouchableOpacity style={styles.button1}>
                    <View style={styles.buttonTextRow}>
                        <AntDesign name="google" size={24} color="white" />
                        <Text style={styles.buttonText} numberOfLines={1}>Continue with Google</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2}>
                    <View style={styles.buttonTextRow}>
                        <AntDesign name="apple1" size={24} color="white" />
                        <Text style={styles.buttonText} numberOfLines={1}>Continue with Apple</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button3}>
                    <View style={styles.buttonTextRow}> 
                        <MaterialIcons name="email" size={24} color="white" style={styles.icon} />
                        <Text style={styles.buttonText} numberOfLines={1}>Continue with Email</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.footerTextContainer}>
                    <View style={styles.textRow}>
                        <Text style={styles.linkText}>Already have an account?</Text>
                        <TouchableOpacity onPress={goToLogin}>
                            <Text style={[styles.linkTextLogin, styles.linkText]}> Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerTextContainer: {
        position: 'absolute',  
        bottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkText: {
        color: "#007FBC",
        fontSize: 16,
    },
    linkTextLogin: {
        fontWeight: "bold",
    },
    buttonTextRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    button1: {
        backgroundColor: "#5F4078",
        marginTop: 70,
        marginBottom: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: screenHeight * 0.015,
        paddingHorizontal: screenWidth * 0.20,
    },
    button2: {
        backgroundColor: "#5F4078",
        borderRadius: 50,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: screenHeight * 0.015,
        paddingHorizontal: screenWidth * 0.21,
    },
    button3: {
        backgroundColor: "#5F4078",
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: screenHeight * 0.015,
        paddingHorizontal: screenWidth * 0.21,
    },
    buttonText: {
        color: "#FFFF",
        fontSize: 16,
        marginLeft: 10,
    }
});

export default CreateAccountScreen;
