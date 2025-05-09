import { React, useState, } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Image, Text, TextInput, Alert, } from 'react-native';
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
            mediaTypes: ImagePicker.MediaType,
            quality: 1,
        });
        
        // TODO: proper error handling
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        SecureStore.getItemAsync('jwt_token').then(token => {
            const formData = new FormData();

            Alert.alert("Uploading image...");
            formData.append('file', {
                uri: result.assets[0].uri,
                type: result.assets[0].type,
                name: result.assets[0].fileName,
            });

            fetch(`${apiUrl}/api/v1/auth/user/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            }).then(_ => {
                if (!result.canceled) {
                    setImage(result.assets[0].uri);
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
        }).catch(err => { 
            navigation.navigate('RegistrationScreen');
            console.error(`Error while getting token: ${err}`)
        });
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
                    <Text style={styles.buttonText}>add profile picture</Text>
                </TouchableOpacity>
                
                {image ? (
                    <TouchableOpacity style={styles.button2} onPress={handleContinue}>
                        <Text style={styles.buttonText}>next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button2} onPress={handleContinue}>
                        <Text style={styles.buttonText}>skip</Text>
                    </TouchableOpacity>
                )}

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
        fontSize: 38, 
        fontWeight: "bold", 
        marginBottom: 10,
        fontFamily: 'Work Sans'
    },
    text: {
        color: "#2E5E76",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 50,
        textAlign: "center",
        marginLeft: 30,
        marginRight: 30,
        fontFamily: 'Work Sans'
    },
    button1: {
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
    button2: {
        backgroundColor: "#9680B6",
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

export default CreateAccountProfileScreen;