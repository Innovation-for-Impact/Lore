import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SuccessModalProps {
  title: string
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  buttonText: string
  callback?: () => void
}

export function SuccessModal({ title, visible, setVisible, buttonText, callback }: SuccessModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={styles.fullScreenContainer}>
        <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
      </View>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.iconSuccessFailTextContainer}>
            <Feather name="check-circle" size={25} color="green" />
            <Text style={styles.modalText}>{title}</Text>
          </View>

          <TouchableOpacity onPress={() => {
            setVisible(false);
            if (callback) {
              callback();
            }
          }} style={[styles.modalButton]}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 40
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
})
