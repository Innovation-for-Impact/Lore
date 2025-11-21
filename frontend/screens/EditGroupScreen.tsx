import { Ionicons, Feather } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert, Platform, ActivityIndicator, Modal } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Navigation, RootStackParamList } from '../types/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '../types/constants';
import * as ImagePicker from 'expo-image-picker';

type EditGroupScreenRouteProp = RouteProp<RootStackParamList, 'EditGroupScreen'>;

type Props = {
  route: EditGroupScreenRouteProp;
};

const EditGroupScreen = ({ route }: Props) => {
  const { group } = route.params;
  const navigation = useNavigation<Navigation>();
  const queryClient = useQueryClient();

  const [name, setName] = useState(group.name);
  const [location, setLocation] = useState(group.location);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [error, setError] = useState('');

  const { mutateAsync: updateGroup, isPending: isUpdating } = $api.useMutation(
    "patch",
    "/api/v1/groups/{id}/",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get", "/api/v1/groups/"] });
        Alert.alert("Success", "Group updated successfully!");
        navigation.goBack();
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to update group");
        console.error(error);
      }
    }
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Group name cannot be empty");
      return;
    }

    if (!location.trim()) {
      setError("Location cannot be empty");
      return;
    }

    setError('');

    // using formData like in CreateGroup
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("location", location.trim());
    
    if (image) {
      formData.append("avatar", {
        uri: image.uri,
        name: image.fileName || 'avatar.jpg',
        type: "image/jpeg",
      } as any);
    }

    await updateGroup({
      params: {
        path: {
          id: String(group.id)
        }
      },
      body: formData as any
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload an image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0]);
    }
  };

  const currentAvatarUri = image ? image.uri : group.avatar;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Feather name="check" size={28} color="white" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>edit group</Text>
      
      <ScrollView style={styles.contentWrapper} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {currentAvatarUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: currentAvatarUri }} style={styles.avatar} />
              {image && (
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Feather name="x-circle" size={24} color="#5F4078" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.uploadButton}>
              <Feather name="upload" size={40} color="#9680B6" />
            </View>
          )}
          {!image && (
            <View style={styles.editOverlay}>
              <Feather name="edit-2" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>group name</Text>
          <TextInput
            style={[styles.input, error && error.includes('name') && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError('');
            }}
            placeholder="enter group name"
            placeholderTextColor="#BFBFBF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>location</Text>
          <TextInput
            style={[styles.input, error && error.includes('location') && styles.inputError]}
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (error) setError('');
            }}
            placeholder="enter location"
            placeholderTextColor="#BFBFBF"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.infoBox}>
          <Feather name="info" size={16} color="#44344D" />
          <Text style={styles.infoText}>
            changes will be visible to all group members
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#AFB0E4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  saveButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Work Sans',
    textAlign: 'center',
    marginBottom: 20,
    color: '#44344D',
  },
  contentWrapper: {
    flex: 1,
  },
  avatarContainer: {
    width: '100%',
    height: 200,
    marginBottom: 30,
    position: 'relative',
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
  },
  uploadButton: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9680B6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#44344D',
    borderRadius: 20,
    padding: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Work Sans',
    color: '#44344D',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    fontFamily: 'Work Sans',
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: -10,
    fontFamily: 'Work Sans'
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Work Sans',
    color: '#44344D',
    flex: 1,
  },
});

export default EditGroupScreen;