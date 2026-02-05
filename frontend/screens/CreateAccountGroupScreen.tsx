import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useState, } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import unlockIcon from '../assets/unlock-icon.png';
import { AuthNavigation } from '../navigation/Navigators';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CreateAccountGroupScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failureModalVisible, setFailureModalVisible] = useState(false);
  const [groupCode, setGroupCode] = useState('');
  const [isGroupJoined, setIsGroupJoined] = useState(false);
  const navigation = useNavigation<AuthNavigation>();

  const goBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    // Navigate to the next screen - welcome
    navigation.navigate('CreateAccountWelcomeScreen')
  };

  // api post request using fetch 
  // api/v1/groups/join/ w/ join_code
  const handleJoinGroup = () => {
    // TODO: make this async/await
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
        setIsGroupJoined(true);
        setSuccessModalVisible(true);
      })
      .catch(() => {
        setFailureModalVisible(true);
      });

    setModalVisible(false);
    setGroupCode('');
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
          <Image source={unlockIcon} style={styles.img} />

          <Text style={styles.text}>Invited by someone you know? Accept by entering a code to unlock access.</Text>

          <TouchableOpacity
            style={styles.button1}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={[styles.buttonText, (modalVisible || successModalVisible || failureModalVisible)]}>enter group code</Text>
          </TouchableOpacity>

          {/* Modal for entering group code - - way to show content above existing content*/}
          {/* onRequestClose closes the modal when users go back or swipe on android/swipe, while updating state  */}
          <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.fullScreenContainer}>
              <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
            </View>
            {/* KeyboardAvoidingView ensures that the content is still visible when keyboard is used */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.iconTextContainer}>
                    <Text style={styles.modalTitle}>enter group code</Text>
                    <TouchableOpacity onPress={() => { setModalVisible(false); }}>
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
                      <Text style={styles.modalButtonText}>clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={handleJoinGroup}>
                      <Text style={styles.modalButtonText}>enter</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* Success Modal */}
          <Modal visible={successModalVisible} transparent={true} animationType="fade" onRequestClose={() => setSuccessModalVisible(false)}>
            <View style={styles.fullScreenContainer}>
              <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
            </View>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.iconSuccessFailTextContainer}>
                  <Feather name="check-circle" size={25} color="green" />
                  <Text style={styles.modalText}>joined successfully.</Text>
                </View>

                <View style={styles.successFailButtonRow}>
                  <TouchableOpacity onPress={() => { setSuccessModalVisible(false); }} style={styles.successFailModalButton}>
                    <Text style={styles.modalButtonText}>continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setSuccessModalVisible(false); setModalVisible(true); }} style={[styles.successFailModalButton, styles.secondaryButton]}>
                    <Text style={styles.modalButtonText}>join another</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Failure Modal */}
          <Modal visible={failureModalVisible} transparent={true} animationType="fade" onRequestClose={() => setFailureModalVisible(false)}>
            <View style={styles.fullScreenContainer}>
              <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
            </View>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.iconSuccessFailTextContainer}>
                  <Feather name="x-circle" size={25} color="red" />
                  <Text style={styles.modalText}>group cannot be found.</Text>
                </View>

                <View style={styles.successFailButtonRow}>
                  <TouchableOpacity onPress={() => { setFailureModalVisible(false); }} style={[styles.successFailModalButton, styles.secondaryButton]}>
                    <Text style={styles.modalButtonText}>cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setFailureModalVisible(false); setModalVisible(true); }} style={styles.successFailModalButton}>
                    <Text style={styles.modalButtonText}>try again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {isGroupJoined ? (
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
    marginRight: 60,
    fontFamily: 'Work Sans'
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontFamily: 'Work Sans'
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
    fontWeight: '500',
    fontFamily: 'Work Sans'
  },
  iconSuccessFailTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  modalText: {
    fontSize: 17,
    marginLeft: 10,
    fontFamily: 'Work Sans'
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
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenBlur: {
    flex: 1,
  },
});

export default CreateAccountGroupScreen;
