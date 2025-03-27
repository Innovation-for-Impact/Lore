import React from 'react';
import { StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

function CreateGroup() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [groupName, setGroupName] = useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
          <TouchableOpacity 
              style={[styles.createButton, isButtonActive && styles.activeButton]} 
              onPress={() => {
                  setModalVisible(true);
                  setIsButtonActive(true);
              }}
          >
              <Text style={[styles.createButtonText, (modalVisible) && styles.activeButtonText]}>
                  Create Group
              </Text>
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
                              <Text style={styles.modalTitle}>Create Group Name</Text>
                              <TouchableOpacity onPress={() => {setModalVisible(false); setIsButtonActive(false); }}>
                                  <Feather name="x-square" size={25} color="black" />
                              </TouchableOpacity>
                          </View>

                          <TextInput
                              style={styles.input}
                              placeholder="Group Name"
                              value={groupName}
                              onChangeText={setGroupName}
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

          
        </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    color: '#5F4078',
    backgroundColor: '#FFFF',
    borderWidth: 2,
    borderColor: '#44344D',
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  createButtonText: {
    fontSize: 15,
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
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenBlur: {
      flex: 1,
  },
});

export default CreateGroup;
