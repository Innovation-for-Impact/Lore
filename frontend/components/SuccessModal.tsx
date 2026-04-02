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

// export function SuccessModal({ title, visible, setVisible, buttonText, callback }: SuccessModalProps) {
//   console.log("SuccessModal render. visible =", visible);
//   return (
//     <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={() => setVisible(false)} onShow={() => console.log("MODAL NATIVELY PRESENTED")}>
//       <View>
//         <View style={styles.fullScreenContainer}>
//           <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
//         </View>
//         <View style={styles.modalContainer}>
//           {console.log("Modal is mounted in tree")}
//           <View style={styles.modalContent}>
//             <View style={styles.iconSuccessFailTextContainer}>
//               <Feather name="check-circle" size={25} color="green" />
//               <Text style={styles.modalText}>{title}</Text>
//             </View>

//             <TouchableOpacity onPress={() => {
//               setVisible(false);
//               if (callback) {
//                 callback();
//                 console.log("CALLBACK FIRED");
//               }
//             }}
//             style={[styles.modalButton]}>
//               <Text style={styles.buttonText}>{buttonText}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   )
// }

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     top: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // Use a very slight background color instead of total transparency
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', 
//   },
//   modalContent: {
//     width: 300,
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: '#9680B6',
//     // Adding shadow for iOS depth
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   modalText: {
//     fontSize: 17,
//     marginLeft: 10,
//     fontFamily: 'Work Sans'
//   },
//   modalButton: {
//     backgroundColor: '#44344D',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginHorizontal: 5,
//     paddingHorizontal: 40
//   },
//   fullScreenContainer: {
//     zIndex: 1,
//   },
//   fullScreenBlur: {
//     flex: 1,
//   },
//   iconSuccessFailTextContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 2,
//   },
//   modalContent: {
//     width: 300,
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: '#9680B6',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: '500',
//     fontFamily: 'Work Sans'
//   },
export function SuccessModal({ title, visible, setVisible, buttonText, callback }: SuccessModalProps) {
  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="fade" 
      onRequestClose={() => setVisible(false)}
      // Force overFullScreen to prevent iOS status bar clipping
      presentationStyle="overFullScreen"
    >
      {/* The main container must be flex: 1 and cover the whole screen */}
      <View style={styles.centeredView}>
        
        {/* Simplified Blur: It sits behind the content */}
        <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />

        {/* The Card */}
        <View style={styles.modalContent}>
          <View style={styles.iconSuccessFailTextContainer}>
            <Feather name="check-circle" size={25} color="green" />
            <Text style={styles.modalText}>{title}</Text>
          </View>

          <TouchableOpacity 
            onPress={() => {
              setVisible(false);
              if (callback) callback();
            }}
            style={styles.modalButton}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // This replaces fullScreenContainer and modalContainer
  centeredView: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',   
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
  },
  modalContent: {
    width: '80%', // Use percentage for iOS responsiveness
    maxWidth: 320,
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20, // Rounded looks better on iOS
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9680B6',
    // iOS Shadow - REQUIRED for it not to look flat
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconSuccessFailTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Space before the button
  },
  modalText: {
    fontSize: 18,
    marginLeft: 12,
    fontFamily: 'Work Sans',
    color: '#44344D',
  },
  modalButton: {
    backgroundColor: '#44344D',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%', // Makes button easy to tap
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Work Sans'
  },
});
