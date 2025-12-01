import { BlurView } from "expo-blur";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { Text } from "react-native-gesture-handler";
import React from "react";

type LoadingModalProps = {
  visible: boolean,
  title: string
}

export function LoadingModal({visible, title}: LoadingModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} >
      <View style={styles.fullScreenContainer}>
        <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
      </View>

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.confirmView}>
            <View>
              <ActivityIndicator size="large" color="#44344D" />
            </View>
            <Text style={styles.modalText}>{title}</Text>
          </View>
        </View>
      </View>
    </Modal >
  )
}

const styles = StyleSheet.create({
  modalText: {
    fontSize: 17,
    marginLeft: 10,
    fontFamily: 'Work Sans'
  },
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenBlur: {
    flex: 1,
  },
  confirmView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
})
