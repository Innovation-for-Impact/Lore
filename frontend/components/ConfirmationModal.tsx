import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ConfirmationModalProps = {
  title: string,
  left: string,
  right: string,
  visible: boolean,
  callback: () => void,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export function ConfirmationModal({ title, left, right, visible, setVisible, callback }: ConfirmationModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => setVisible(false)}>
      <View style={styles.fullScreenContainer}>
        <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
      </View>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.iconTextContainer}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={() => { setVisible(false); }}>
              <Feather name="x-square" size={25} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={() => setVisible(false)}>
              <Text style={styles.buttonText}>{ left }</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {
              setVisible(false);
              callback();
            }}>
              <Text style={styles.buttonText}>{ right }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenBlur: {
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
  modalTitle: {
    fontSize: 20,
    marginRight: 51,
    fontFamily: 'Work Sans'
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#44344D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Work Sans'
  },
  clearButton: {
    backgroundColor: '#9680B6',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
