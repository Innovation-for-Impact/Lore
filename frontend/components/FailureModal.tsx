import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FailureModalProps {
  title: string,
  visible: boolean,
  tryAgainCallback: () => void
  cancelCallback: () => void
}

export function FailureModal({ title, visible, tryAgainCallback, cancelCallback }: FailureModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={cancelCallback}>
      <View style={styles.fullScreenContainer}>
        <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
      </View>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.iconSuccessFailTextContainer}>
            <Feather name="x-circle" size={25} color="red" />
            <Text style={styles.modalText}>{title}</Text>
          </View>

          <View style={styles.successFailButtonRow}>
            <TouchableOpacity onPress={cancelCallback} style={styles.modalButton}>
              <Text style={styles.buttonText}>cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={tryAgainCallback} style={[styles.modalButton, styles.secondaryButton]}>
              <Text style={styles.buttonText}>try again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalText: {
    fontSize: 17,
    marginLeft: 10,
    fontFamily: 'Work Sans'
  },
  modalButton: {
    backgroundColor: '#44344D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 30
  },
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenBlur: {
    flex: 1,
  },
  iconSuccessFailTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Work Sans'
  },
  successFailButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#9680B6', // Using the border color for emphasis
  },
})
