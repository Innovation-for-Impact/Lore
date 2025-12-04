import { Feather, Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { $api, infiniteQueryParams, User } from '../types/constants';
import { LoadingModal } from './LoadingModal';
import { pickImage } from '../utils/GroupUtils';
import { useUser } from '../context/UserContext';
import { FailureModal } from './FailureModal';

enum Step {
  name = "name",
  location = "location",
  image = "image",
  members = "members",
  success = "success",
  fail = "fail"
};

function CreateGroup() {
  const { user } = useUser();
  const [groupName, setGroupName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<Step | null>(null);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  const queryClient = useQueryClient();

  const { data, hasNextPage, isFetching, fetchNextPage } = $api.useInfiniteQuery(
    "get",
    "/api/v1/users/",
    {},
    infiniteQueryParams
  )

  useEffect(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching])

  const handleCreateGroupName = () => {
    if (!groupName.trim()) {
      setError("group name can't be empty");
      return;
    }
    setError('');
    setStep(Step.location);
  }

  const handleSetLocation = () => {
    if (!location.trim()) {
      setError("location can't be empty");
      return;
    }
    setError('');
    setStep(Step.image);
  }

  const handleContinueWithImage = () => {
    if (!image) {
      setError("Pick an image");
      return;
    }
    if (error) setError('');
    setStep(Step.members);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Filter results based on the search query
    const filteredResults = data?.pages.flatMap(data => data.results).filter(userData => {
      const fullName = `${userData.first_name} ${userData.last_name}`.toLowerCase();
      const matchesQuery = fullName.includes(query.toLowerCase());
      const notLoggedIn = user!.id !== userData.id;
      return matchesQuery && notLoggedIn;
    });
    setSearchResults(filteredResults === undefined ? [] : filteredResults);
  };

  const handleAddMember = (user: User) => {
    if (!selectedMembers.some((member) => member.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleRemoveMember = (userId: number) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== userId));
  };

  const { mutateAsync: handleCreateGroup, isPending: groupCreateLoading } = $api.useMutation(
    "post",
    "/api/v1/groups/", {
    onError: () => {
      setStep(Step.fail);
    },
    onSuccess: () => {
      setStep(Step.success);
      queryClient.invalidateQueries({ queryKey: $api.queryOptions("get", "/api/v1/groups/").queryKey });
    }
  }
  )

  return (
    <>
      <TouchableOpacity
        style={[styles.createButton, step !== null && styles.activeButton]}
        onPress={() => {
          setStep(Step.name);
          setGroupName('');
          setSelectedMembers([]);
          setLocation('');
          setImage(null);
          setSearchQuery('');
          setSearchResults([]);
          setError('');
        }}
      >
        <Text style={[styles.createButtonText, step !== null && styles.activeButtonText]}>
          create group
        </Text>
      </TouchableOpacity>

      {/* Modal for entering group name */}
      <Modal animationType="fade" transparent={true} visible={step === Step.name} onRequestClose={() => {
        setStep(null);
      }}>
        <View style={styles.fullScreenContainer}>
          <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.iconTextContainer}>
                <Text style={styles.modalTitle}>create group name</Text>
                <TouchableOpacity onPress={() => { setStep(null); }}>
                  <Feather name="x-square" size={25} color="black" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="group name"
                placeholderTextColor="#BFBFBF"
                value={groupName}
                onChangeText={(text) => {
                  setGroupName(text);
                  if (error) setError('');
                }}
                keyboardType="default"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={() => setGroupName('')}>
                  <Text style={styles.buttonText}>clear</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleCreateGroupName}>
                  <Text style={styles.buttonText}>next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal for entering location */}
      <Modal animationType="fade" transparent={true} visible={step === Step.location} onRequestClose={() => {
        setStep(null);
      }}>
        <View style={styles.fullScreenContainer}>
          <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.iconTextContainer}>
                <Text style={styles.searchModalTitle}>set location</Text>
                <TouchableOpacity onPress={() => {
                  setStep(null);
                }}>
                  <Feather name="x-square" size={25} color="black" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="location"
                placeholderTextColor="#BFBFBF"
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                  if (error) setError('');
                }}
                keyboardType="default"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={() => {
                    if (error) setError('');
                    setStep(Step.name);
                  }}
                >
                  <Text style={styles.buttonText}>back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSetLocation}>
                  <Text style={styles.buttonText}>next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal for uploading image */}
      <Modal animationType="fade" transparent={true} visible={step === Step.image} onRequestClose={() => {
        setStep(null);
      }}>
        <View style={styles.fullScreenContainer}>
          <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.iconTextContainer}>
                <Text style={styles.imageModalTitle}>upload image</Text>
                <TouchableOpacity onPress={() => {
                  setStep(null);
                }}>
                  <Feather name="x-square" size={25} color="black" />
                </TouchableOpacity>
              </View>

              {/* Image preview */}
              {image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setImage(null)}
                  >
                    <Feather name="x-circle" size={24} color="#5F4078" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={async () => {
                  setImage(await pickImage());
                }}>
                  <Feather name="upload" size={40} color="#9680B6" />
                </TouchableOpacity>
              )}

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={() => {
                    if (error) setError('');
                    setStep(Step.location);
                  }}
                >
                  <Text style={styles.buttonText}>back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleContinueWithImage}>
                  <Text style={styles.buttonText}>next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Quick add members modal */}
      <Modal animationType="fade" transparent={true} visible={step === Step.members} onRequestClose={() => {
        setStep(null);
      }}>
        <View style={styles.fullScreenContainer}>
          <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.searchModalTitle}>add members</Text>

              {/* search feature */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#44344D" style={styles.icon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="search members"
                  placeholderTextColor="#BFBFBF"
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    handleSearch(text);
                  }}
                  keyboardType="default"
                />
              </View>

              {/* add members content */}
              <View style={styles.searchResults}>
                {searchResults.length > 0 && (
                  <ScrollView>
                    {searchResults.map((user) => (
                      <TouchableOpacity key={user.id} style={styles.resultItem} onPress={() => handleAddMember(user)}>
                        <Text>{user.first_name + " " + user.last_name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View style={styles.selectedMembersContainer}>
                <Text style={styles.selectedMembersTitle}>Selected Members:</Text>
                {selectedMembers.length === 0 ? (
                  <Text style={styles.noMembersText}>No members selected.</Text>
                ) : (
                  selectedMembers.map((member) => (
                    <View key={member.id} style={styles.memberItem}>
                      <Text style={styles.memberText}>{member.first_name + " " + member.last_name}</Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveMember(member.id)}
                      >
                        <Text style={styles.removeText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={() => {
                    setStep(Step.image);
                  }}>
                  <Text style={styles.buttonText}>back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    setStep(null);
                    const s = await handleCreateGroup({
                      body: {
                        name: groupName,
                        location: location,
                        members: [...selectedMembers.map(member => member.id)],
                        avatar: {
                          uri: image!.uri,
                          name: image!.fileName,
                          type: "image/jpeg",
                        }
                      },
                      // https://openapi-ts.dev/openapi-fetch/api#bodyserializer
                      bodySerializer: (body) => {
                        const formData = new FormData();
                        formData.append("name", body.name);
                        formData.append("location", body.location);
                        formData.append("avatar", body.avatar);
                        body.members.forEach(memberId => {
                          formData.append("members", memberId);
                        })
                        return formData;
                      }
                    });
                    setGroupCode(s.join_code);
                  }}>
                  <Text style={styles.buttonText}>create group</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <LoadingModal visible={groupCreateLoading} title={"group creating..."} />

      {/* Group created confirmation modal */}
      <Modal animationType="fade" transparent={true} visible={step === Step.success} onRequestClose={() => {
        setStep(null);
      }}>
        <View style={styles.fullScreenContainer}>
          <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
        </View>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.confirmView}>
              <Feather name="check-circle" size={25} color="green" />
              <Text style={styles.modalText}>group created.</Text>
            </View>
            <>
              <Text style={styles.groupCodeText}>{groupCode}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setStep(null);
                    Clipboard.setStringAsync(groupCode);
                    if (Platform.OS === 'android') {
                      ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
                    } else {
                      Alert.alert('Text copied to clipboard!');
                    }
                  }}
                >
                  <Text style={styles.buttonText}>copy code</Text>
                </TouchableOpacity>
              </View>
            </>
          </View>
        </View>
      </Modal>

      <FailureModal title={"group creation error"} visible={step === Step.fail} tryAgainCallback={() => {setStep(Step.name)}} cancelCallback={() => setStep(null)}/>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    width: '100%',
    height: 40,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#44344D',
    paddingHorizontal: 10,
    fontFamily: 'Work Sans'
  },
  searchModalTitle: {
    fontSize: 20,
    marginRight: 120,
    fontFamily: 'Work Sans'
  },
  createButton: {
    color: '#5F4078',
    backgroundColor: '#FFFF',
    borderWidth: 2,
    borderColor: '#44344D',
    borderRadius: 20,
    paddingVertical: 5,
    width: '40%',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 15,
    fontFamily: 'Work Sans',
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
    marginRight: 51,
    fontFamily: 'Work Sans'
  },
  modalText: {
    fontSize: 17,
    marginLeft: 10,
    fontFamily: 'Work Sans'
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#44344D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginRight: 10,
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
    width: '100%',
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
  activeButton: {
    backgroundColor: '#5F4078',
    borderColor: 'white',
  },
  activeButtonText: {
    color: 'white',
    fontFamily: 'Work Sans'
  },
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenBlur: {
    flex: 1,
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
  searchResults: {
    width: "90%",
    marginBottom: 15,
    maxHeight: 150,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedMembersContainer: {
    marginTop: 10,
    width: '100%',
    padding: 10,
  },
  selectedMembersTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Work Sans',
    color: '#44344D',
  },
  noMembersText: {
    color: '#44344D',
    fontFamily: 'Work Sans'
  },
  memberItem: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  memberText: {
    fontSize: 15,
    paddingBottom: 5,
    fontFamily: 'Work Sans'
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
    width: '30%',
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Work Sans'
  },
  confirmView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  groupCodeText: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 10,
    fontFamily: 'Work Sans',
  },
  imageModalTitle: {
    fontSize: 20,
    marginRight: 100,
    fontFamily: 'Work Sans'
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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
    height: 200,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9680B6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    marginTop: 10,
    color: '#9680B6',
    fontSize: 16,
    fontFamily: 'Work Sans',
  },
  iconSuccessFailTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  successFailButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#44344D',
  },
});

export default CreateGroup;
