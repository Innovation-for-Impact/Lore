import { React, useState, } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Image, Text, TextInput, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Logo from '../assets/logo-transparent-white.png';

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

        // TODO: API endpoint to create user

        // TODO: API endpoint to check email
        // if email already exists in database - X mark
        // else check mark

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
                
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inputPasswords}
                        placeholder="Password"
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
                        placeholder="Confirm Password"
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
                    <Text style={styles.buttonText}>Create Account</Text>
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
        fontSize: 45, 
        fontWeight: "bold", 
        marginBottom: 30 
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
    },
    inputPasswords: {
        width: screenWidth * 0.78,
        fontSize: 16,
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
        color: "#007FBC",
        fontSize: 16,
    },
    linkTextTerms: {
        fontWeight: "bold",
    },
});

export default CreateAccountEmailScreen;