import { React, useState, } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Image, Text, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import unlockIcon from '../assets/unlock-icon.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const CreateAccountGroupScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [failureModalVisible, setFailureModalVisible] = useState(false);
    const [groupCode, setGroupCode] = useState('');

    const goBack = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        // Navigate to the next screen - welcome
        navigation.navigate('CreateAccountWelcomeScreen');
    };

    // api post request using fetch 
    // api/v1/groups/join/ w/ join_code
    const handleJoinGroup = () => {
        fetch(`/api/v1/groups/join/`, {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ join_code: groupCode }),
        })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(() => {
            setSuccessModalVisible(true);
        })
        .catch((error) => {
            console.error(error);
            setFailureModalVisible(true);
        })

        setModalVisible(false);
        setGroupCode('');
    };

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <TouchableOpacity
                    style={{ position: 'absolute', top: 60, left: 15, zIndex: 10 }} 
                    onPress={goBack}
                >
                    <Ionicons name="arrow-back" size={35} color="white" />
                </TouchableOpacity>

                <View style={styles.container}>
                    <Text style={styles.title}>Join A Group</Text>
                    <Image source={unlockIcon} style={styles.img}/>

                    <Text style={styles.text}>Invited by someone you know? Accept by entering a code to unlock access.</Text>
                    
                    <TouchableOpacity 
                        style={styles.button1} 
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Text style={[styles.buttonText, (modalVisible || successModalVisible || failureModalVisible)]}>Enter group code</Text>
                    </TouchableOpacity>

                    {/* Modal for entering group code - - way to show content above existing content*/}
                    {/* onRequestClose closes the modal when users go back or swipe on android/swipe, while updating state  */}
                    <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                        {/* KeyboardAvoidingView ensures that the content is still visible when keyboard is used */}
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <View style={styles.iconTextContainer}> 
                                        <Text style={styles.modalTitle}>Enter Group Code</Text>
                                        <TouchableOpacity onPress={() => {setModalVisible(false); }}>
                                            <Feather name="x-square" size={25} color="black" />
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        style={styles.input}
                                        placeholder="Group Code"
                                        value={groupCode}
                                        onChangeText={setGroupCode}
                                        keyboardType="default"
                                    />
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity style={[styles.modalButton, styles.clearButton]} onPress={() => setGroupCode('')}>
                                            <Text style={styles.modalButtonText}>Clear</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.modalButton} onPress={handleJoinGroup}>
                                            <Text style={styles.modalButtonText}>Enter</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>

                    {/* Success Modal */}
                    <Modal visible={successModalVisible} transparent={true} animationType="fade" onRequestClose={() => setSuccessModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.iconSuccessFailTextContainer}>
                                    <Feather name="check-circle" size={25} color="green" />
                                    <Text style={styles.modalText}>Joined Successfully.</Text>
                                </View>

                                <View style={styles.successFailButtonRow}>
                                    <TouchableOpacity onPress={() => {setSuccessModalVisible(false); }} style={styles.successFailModalButton}>
                                        <Text style={styles.modalButtonText}>Continue</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { setSuccessModalVisible(false); setModalVisible(true); }} style={[styles.successFailModalButton, styles.secondaryButton]}>
                                        <Text style={styles.modalButtonText}>Join Another</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Failure Modal */}
                    <Modal visible={failureModalVisible} transparent={true} animationType="fade" onRequestClose={() => setFailureModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.iconSuccessFailTextContainer}>
                                    <Feather name="x-circle" size={25} color="red" />
                                    <Text style={styles.modalText}>Group Cannot Be Found.</Text>
                                </View>

                                <View style={styles.successFailButtonRow}>
                                    <TouchableOpacity onPress={() => {setFailureModalVisible(false); }} style={[styles.successFailModalButton, styles.secondaryButton]}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { setFailureModalVisible(false); setModalVisible(true);}} style={styles.successFailModalButton}>
                                        <Text style={styles.modalButtonText}>Try Again</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    
                    {successModalVisible ? (
                        <TouchableOpacity style={styles.button2} onPress={handleContinue}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button2} onPress={handleContinue}>
                            <Text style={styles.buttonText}>Skip</Text>
                        </TouchableOpacity>
                    )}

                </View>
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: { 
        backgroundColor: "#AFB0E4",
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    img: {
        width: screenWidth * 0.5,
        height: screenWidth * 0.5,
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
    // modal styling
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#9680B6',
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    modalTitle: {
        fontSize: 20,
        marginRight: 70,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginLeft: 111,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#44344D',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    clearButton: {
        backgroundColor: '#9680B6',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    iconSuccessFailTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    modalText: {
        fontSize: 17,
        marginLeft: 10,
    },
    successFailButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    successFailModalButton: {
        flex: 1,
        backgroundColor: '#9680B6',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    secondaryButton: {
        backgroundColor: '#44344D',
    },
});

export default CreateAccountGroupScreen;