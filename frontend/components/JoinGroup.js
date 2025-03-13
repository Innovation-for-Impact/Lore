import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

function JoinGroup() {
    const [modalVisible, setModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [failureModalVisible, setFailureModalVisible] = useState(false);
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [groupCode, setGroupCode] = useState('');
    // const correctCode = '12345'; // temporary code, will need to grab code from database

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
        // if (groupCode === correctCode) { // fix later
        //     setSuccessModalVisible(true);
        // } else {
        //     setFailureModalVisible(true);
        // }
        setModalVisible(false);
        setGroupCode('');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity 
                    style={[styles.joinButton, isButtonActive && styles.activeButton]} 
                    onPress={() => {
                        setModalVisible(true);
                        setIsButtonActive(true);
                    }}
                >
                    <Text style={[styles.joinButtonText, (modalVisible || successModalVisible || failureModalVisible) && styles.activeButtonText]}>
                        Join Group
                    </Text>
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
                                    <TouchableOpacity onPress={() => {setModalVisible(false); setIsButtonActive(false); }}>
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
                                    <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={() => setGroupCode('')}>
                                        <Text style={styles.buttonText}>Clear</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.button} onPress={handleJoinGroup}>
                                        <Text style={styles.buttonText}>Enter</Text>
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
                                <TouchableOpacity onPress={() => {setSuccessModalVisible(false); setIsButtonActive(false); }} style={styles.modalButton}>
                                    <Text style={styles.buttonText}>Continue</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setSuccessModalVisible(false); setModalVisible(true); setIsButtonActive(true); }} style={[styles.modalButton, styles.secondaryButton]}>
                                    <Text style={styles.buttonText}>Join Another</Text>
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
                                <TouchableOpacity onPress={() => {setFailureModalVisible(false); setIsButtonActive(false); }} style={[styles.modalButton, styles.secondaryButton]}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setFailureModalVisible(false); setModalVisible(true); setIsButtonActive(true);}} style={styles.modalButton}>
                                    <Text style={styles.buttonText}>Try Again</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    joinButton: {
        color: '#5F4078',
        backgroundColor: '#FFFF',
        borderWidth: 2,
        borderColor: '#44344D',
        borderRadius: 20,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 25,
    },
    joinButtonText: {
        fontSize: 15,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
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
    button: {
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
    buttonText: {
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
    modalButton: {
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
    activeButton: {
        backgroundColor: '#5F4078',
        borderColor: 'white',
    },
    activeButtonText: {
        color: 'white',
    },
});

export default JoinGroup;