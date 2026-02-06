import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FailureModal } from '../components/FailureModal';
import { SuccessModal } from '../components/SuccessModal';
import { useUser } from '../context/UserContext';
import { ProfileNavigation } from '../navigation/Navigators';
import { $api, setTokens } from '../types/constants';
import { pickImage } from '../utils/GroupUtils';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ProfileNavigation>();
  const { user, setUser } = useUser();
  const [userAvatar, setUserAvatar] = useState<ImagePicker.ImagePickerAsset | null>(null);

  if (!user) {
    return;
  }

  const [firstName, setFirstName] = useState(user.first_name)
  const [lastName, setLastName] = useState(user.last_name)
  const [successModal, setSuccessModal] = useState(false)
  const [failureModal, setFailureModal] = useState(false)
  const [confirmation, setConfirmation] = useState(false)

  // State for form fields
  // const [email, setEmail] = useState('admin@lore.com');
  // const [phone, setPhone] = useState('+1 123-456-7890');
  // const [emailNotif, setEmailNotif] = useState(true);
  // const [pushNotif, setPushNotif] = useState(true);

  const { mutateAsync: updateUser } = $api.useMutation(
    "patch",
    "/api/v1/users/{id}/",
    {
      onSuccess: () => {
        setSuccessModal(true);
        setUser({
          first_name: firstName,
          last_name: lastName,
          id: user.id,
          url: user.url,
          avatar: userAvatar?.uri ?? user.avatar
        })
      },
      onError: (e) => {
        setFailureModal(true)
        console.log(e)
      }
    }
  )

  const queryClient = useQueryClient();
  const { mutateAsync: deleteUser } = $api.useMutation(
    "delete",
    "/api/v1/users/{id}/",
    {
      onSuccess: async () => {
        // Log out
        setUser(null)
        setTokens(null, null);
        queryClient.clear()
      }
    }
  )

  async function saveProfile() {
    if (!user) {
      return
    }
    updateUser({
      body: {
        first_name: firstName,
        last_name: lastName,
        id: user.id,
        avatar: {
          uri: userAvatar ? userAvatar.uri : user.avatar,
          name: userAvatar ? userAvatar.fileName : "",
          type: userAvatar?.mimeType ?? "image/jpeg"
        },
        url: user.url
      },
      params: {
        path: {
          id: user?.id
        }
      },
      bodySerializer: (body) => {
        if (body) {
          const formData = new FormData();
          formData.append("first_name", body.first_name);
          formData.append("last_name", body.last_name);
          formData.append("id", body.id);
          formData.append("url", body.url);
          if (userAvatar) {
            formData.append("avatar", body.avatar);
          }
          return formData;
        }
      }
    })
  }

  return (
    <>
      <SuccessModal buttonText='back' setVisible={setSuccessModal} title='profile updated!' visible={successModal} />
      <FailureModal visible={failureModal} title='failed to update profile' tryAgainCallback={saveProfile} cancelCallback={() => setFailureModal(false)} />
      <ConfirmationModal visible={confirmation} setVisible={setConfirmation} title='are you sure you want to delete?' left='cancel' right='delete' callback={async () => {
        deleteUser({
          params: {
            path: {
              id: user.id
            }
          }
        })
      }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + 100
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Navigation */}
          <View style={styles.header}>
            <TouchableOpacity onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={35} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Profile Image with Edit Badge */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={async () => {
              setUserAvatar(await pickImage());
            }}>
              <Image
                // Display the userAvatar, else the avatar from the DB, else a template avatar
                source={{ uri: userAvatar?.uri ?? user?.avatar ?? `https://ui-avatars.com/api/?name=${user?.first_name} ${user?.last_name}` }}
                style={styles.avatar}
              />
              <View style={styles.editBadge}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.nameLabel}>
              {user?.first_name} {user?.last_name}
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <InputGroup label="First Name" value={firstName} onChangeText={setFirstName} />
            <InputGroup label="Last Name" value={lastName} onChangeText={setLastName} />
            {/* <InputGroup label="email" value={email} onChangeText={setEmail} /> */}
            {/* <InputGroup label="phone number" value={phone} onChangeText={setPhone} /> */}
            {/* <InputGroup label="current password" value="********" secureTextEntry /> */}

            {/* Notifications Section */}
            {/* <Text style={styles.sectionLabel}>notifications</Text> */}
            {/* <CheckboxRow */}
            {/*   label="email notifications" */}
            {/*   isActive={emailNotif} */}
            {/*   onPress={() => setEmailNotif(!emailNotif)} */}
            {/* /> */}
            {/* <CheckboxRow */}
            {/*   label="push notifications" */}
            {/*   isActive={pushNotif} */}
            {/*   onPress={() => setPushNotif(!pushNotif)} */}
            {/* /> */}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={[styles.solidButton, { backgroundColor: '#5E4B81' }]} onPress={saveProfile}>
              <Text style={styles.buttonText}>save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.solidButton, { backgroundColor: '#A18DBF', marginTop: 15 }]} onPress={() => {
              setConfirmation(true);
            }}>
              <Text style={styles.buttonText}>delete account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    </>
  );
};

interface InputGroupProps extends TextInputProps {
  label: string;
}

const InputGroup = ({ label, ...props }: InputGroupProps) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput style={styles.input} {...props} placeholderTextColor="#999" />
  </View>
);

// const CheckboxRow = ({ label, isActive, onPress }) => (
//   <TouchableOpacity style={styles.checkboxRow} onPress={onPress} activeOpacity={0.8}>
//     <Text style={styles.checkboxLabel}>{label}</Text>
//     <FontAwesome
//       name={isActive ? "check-square" : "square-o"}
//       size={22}
//       color="#5E4B81"
//     />
//   </TouchableOpacity>
// );

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B2B0E6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center'
  },
  avatarSection: { alignItems: 'center', marginTop: 10 },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#D48D4D'
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5E4B81',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B2B0E6'
  },
  nameLabel: { fontSize: 36, color: '#3F3356', fontWeight: '300', marginTop: 10 },
  formContainer: { paddingHorizontal: 25, marginTop: 10 },
  fieldLabel: { color: '#3F3356', fontWeight: '700', fontSize: 14, marginBottom: 5 },
  sectionLabel: { color: '#3F3356', fontWeight: '700', fontSize: 14, marginTop: 15, marginBottom: 10 },
  inputWrapper: { marginBottom: 15 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#666',
    borderWidth: 1,
    borderColor: '#999'
  },
  checkboxRow: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#999'
  },
  checkboxLabel: { color: '#5E4B81', fontSize: 15 },
  actionSection: { paddingHorizontal: 25, marginTop: 20 },
  solidButton: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '400' },
  navBar: {
    position: 'absolute',
    left: 40,
    right: 40,
    backgroundColor: '#FFF',
    height: 70,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
  }
});

