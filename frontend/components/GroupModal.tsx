import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Modal, Platform, Pressable, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { components } from '../types/backend-schema';
import { useUser } from '../context/UserContext';
import { $api } from '../types/constants';
import { ConfirmationModal } from './ConfirmationModal';
import { useQueryClient } from '@tanstack/react-query';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const isSmallScreen = screenHeight < 700;        // iPhone SE
const isMediumScreen = screenHeight >= 700 && screenHeight < 900; // iPhone 11/12/13/14/15
// const isLargeScreen = screenHeight >= 900;      // Pro Max / Plus

const cardHeight = Math.max(screenHeight * 0.27, 200); // minimum 200px height
const imageHeight = Math.max(screenHeight * 0.2, 145); // minimum 120px for image

const fontSize = {
  title: isSmallScreen ? 15 : isMediumScreen ? 16 : 17,
  subtitle: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
  location: isSmallScreen ? 13 : isMediumScreen ? 14 : 15,
};
type Group = components["schemas"]["Group"];

type GroupModalProps = {
  group: Group,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export function GroupModal({ group, visible, setVisible }: GroupModalProps) {
  const [confirmationModal, setConfirmationModal] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutateAsync: leaveGroup } = $api.useMutation(
    "delete",
    "/api/v1/groups/{loregroup_pk}/members/{id}/",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["get", "/api/v1/groups/"]});
      }
    }
  )

  async function handleLeaveGroup() {
    leaveGroup({
      params: {
        path: {
          id: user!.id,
          loregroup_pk: String(group.id)
        }
      }
    })
    setVisible(false);
  }

  return (
    <>
      <ConfirmationModal title={"leave group?"} left={"cancel"} right={"leave"} visible={confirmationModal} setVisible={setConfirmationModal} callback={handleLeaveGroup}/>
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => setVisible(false)}>
        <View style={styles.overlayBackground}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.fullScreenContainer}>
              <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
            </View>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.imageContainer}>
                  {
                    group.avatar ? (
                      <Image source={{ uri: group.avatar }} style={styles.image} />
                    ) : <View style={styles.image} />
                  }

                  <View style={styles.overlay}>
                    <Ionicons name="people" size={16} color="white" />
                    <Text style={styles.memberCount}>{group.num_members}</Text>
                  </View>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.title}>{group.name}</Text>

                  <View style={styles.location}>
                    <Ionicons name="location-sharp" size={16} color="#44344D" />
                    <Text style={styles.locationText}>{group.location}</Text>
                  </View>

                  <View style={styles.codeRow}>
                    <Ionicons name="key" size={16} />
                    <Text style={styles.joinCodeText}> Join Code: {group.join_code}</Text>
                    <TouchableOpacity
                      style={styles.copyButton}
                      activeOpacity={0.7}
                      onPress={() => {
                        Clipboard.setStringAsync(group.join_code);
                        if (Platform.OS === 'android') {
                          ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
                        } else {
                          Alert.alert('Text copied to clipboard!');
                        }
                      }}
                    >
                      <Ionicons name="clipboard-outline" size={16} color="#9680B6" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.location}>
                    <Ionicons name="calendar" size={16} />
                    <Text style={styles.subtitle}> Created: {new Date(group.created).toLocaleDateString()} </Text>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.leaveButton,
                      { backgroundColor: pressed ? "#ff5555" : "red" },
                    ]}
                    onPress={() => setConfirmationModal(true)}
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>Leave Group</Text>
                  </Pressable>
                </View>
              </View>
            </View>

          </ScrollView>
        </View>
      </Modal>
    </>
  )
}
const styles = StyleSheet.create({
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40, // gives breathing room when scrolling
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '95%',
    height: imageHeight,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9CAAC7',
  },
  overlay: {
    position: 'absolute',
    bottom: isSmallScreen ? -40 : isMediumScreen ? -50 : -60,
    right: 15,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
  },
  memberCount: {
    color: 'white',
    marginRight: 5,
    fontWeight: '600',
    fontFamily: 'Work Sans',
    fontSize: isSmallScreen ? 13 : 14,
  },
  textContainer: {
    flex: 1.4,
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: isSmallScreen ? 45 : isMediumScreen ? 60 : 65,
    gap: isSmallScreen ? 4 : isMediumScreen ? 5 : 6,
  },
  title: {
    fontWeight: '600',
    fontSize: fontSize.title,
    fontFamily: 'Work Sans',
    color: '#44344D',
  },
  subtitle: {
    fontSize: fontSize.subtitle,
    fontFamily: 'Work Sans',
    fontWeight: '600',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    color: '#44344D',
    fontFamily: 'Work Sans',
    fontSize: fontSize.location,
  },
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenBlur: {
    flex: 1,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    width: screenWidth * 0.9,
    maxWidth: 350,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
    width: '100%',
  },
  copyButton: {
    padding: 4,
  },
  joinCodeText: {
    fontSize: fontSize.subtitle,
    fontFamily: 'Work Sans',
    fontWeight: '600',
    color: '#44344D',
    textAlign: 'left',
    flex: 1
  },
  leaveButton: {
    borderRadius: 20,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    // optional: shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // optional: elevation for Android
    elevation: 5,
  },
});

