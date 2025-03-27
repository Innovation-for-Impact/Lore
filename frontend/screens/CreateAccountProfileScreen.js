import { React, useState, } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Image, Text, TextInput, } from 'react-native';
import profileIcon from '../assets/profile-icon.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CreateAccountProfileScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);

    const goBack = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        // Navigate to the next screen - join group
        navigation.navigate('CreateAccountGroupScreen');
    };

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permission!');
        }
    };

    const handleUpload = async () => {
        await requestPermission();
    
        const result = await ImagePicker.launchImageLibraryAsync({
            // mediaTypes: "Images",
            mediaTypes: ImagePicker.MediaType.IMAGE,
            quality: 1,
        });
        
        // TODO: API Endpoint
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
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
                <Text style={styles.title}>Add A Profile Pic</Text>
                {/* <Image source={profileIcon} style={styles.img}/> */}

                {image ? (
                    <Image source={{ uri: image }} style={styles.profileImage} />
                ) : (
                    <Image source={profileIcon} style={styles.img}/>
                )}

                <Text style={styles.text}>Add a profile picture so your friends know it's you. Everyone will be able to see your picture.</Text>

                <TouchableOpacity style={styles.button1} onPress={handleUpload}>
                    <Text style={styles.buttonText}>Add profile picture</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button2} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Skip</Text>
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
        width: screenWidth * 0.5,
        height: screenWidth * 0.5,
        marginBottom: 25,
    },
    profileImage: {
        width: screenWidth * 0.5,
        height: screenWidth * 0.5,
        borderRadius: 999,
        marginBottom: 20,
        borderWidth: 5,
        borderColor: '#9680B6',
    },
    title: { 
        color: "#5F4078",
        fontSize: 45, 
        fontWeight: "bold", 
        marginBottom: 10,
    },
    text: {
        color: "#007FBC",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 50,
        textAlign: "center",
        marginLeft: 30,
        marginRight: 30,
    },
    button1: {
        backgroundColor: "#5F4078",
        width: screenWidth * 0.9,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    button2: {
        backgroundColor: "#9680B6",
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

export default CreateAccountProfileScreen;