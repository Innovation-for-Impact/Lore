import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { $api } from '../types/constants';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingModal } from './LoadingModal';

function JoinGroup() {
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failureModalVisible, setFailureModalVisible] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [error, setError] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const queryClient = useQueryClient();

  const { mutateAsync: joinGroup, isPending } = $api.useMutation(
    "post",
    "/api/v1/groups/join/",
    {
      onError: () => {
        setFailureModalVisible(true);
      },
      onSuccess: () => {
        setSuccessModalVisible(true);
        queryClient.invalidateQueries({queryKey: ["get", "/api/v1/groups/"]});
      }
    }
  );

  const handleJoinGroup = async () => {
    if (!groupCode) {
      setError("enter a group code");
      return;
    }
    joinGroup({
      body: {
        join_code: groupCode
      }
    })
    setModalVisible(false);
  };

  return (
    <>
      <LoadingModal visible={isPending} title={"joining group..."} />
      <TouchableOpacity
        style={[styles.joinButton, isButtonActive && styles.activeButton]}
        onPress={() => {
          setModalVisible(true);
          setIsButtonActive(true);
          setError('');
          setGroupCode('');
        }}
      >
        <Text style={[styles.joinButtonText, (modalVisible || successModalVisible || failureModalVisible) && styles.activeButtonText]}>
          join group
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
                <Text style={styles.modalTitle}>enter group code</Text>
                <TouchableOpacity onPress={() => { setModalVisible(false); setIsButtonActive(false); }}>
                  <Feather name="x-square" size={25} color="black" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="group code"
                placeholderTextColor="#BFBFBF"
                value={groupCode}
                onChangeText={setGroupCode}
                keyboardType="default"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={() => setGroupCode('')}>
                  <Text style={styles.buttonText}>clear</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleJoinGroup}>
                  <Text style={styles.buttonText}>enter</Text>
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
              <TouchableOpacity onPress={() => { setSuccessModalVisible(false); setIsButtonActive(false); }} style={styles.modalButton}>
                <Text style={styles.buttonText}>continue</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSuccessModalVisible(false); setModalVisible(true); setIsButtonActive(true); }} style={[styles.modalButton, styles.secondaryButton]}>
                <Text style={styles.buttonText}>join another</Text>
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
              <Text style={styles.modalText}>failed to join group.</Text>
            </View>

            <View style={styles.successFailButtonRow}>
              <TouchableOpacity onPress={() => { setFailureModalVisible(false); setIsButtonActive(false); }} style={styles.modalButton}>
                <Text style={styles.buttonText}>cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setFailureModalVisible(false); setModalVisible(true); setIsButtonActive(true); }} style={[styles.modalButton, styles.secondaryButton]}>
                <Text style={styles.buttonText}>try again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  joinButton: {
    color: '#5F4078',
    backgroundColor: '#FFFF',
    borderWidth: 2,
    borderColor: '#44344D',
    borderRadius: 20,
    paddingVertical: 5,
    width: '40%',
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 15,
    fontFamily: 'Work Sans'
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
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenBlur: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: -10,
    fontFamily: 'Work Sans'
  },
  inputError: {
    borderColor: 'red',
  },
});

export default JoinGroup;
