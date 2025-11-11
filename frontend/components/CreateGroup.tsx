import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Modal, View, TextInput, ScrollView, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { $api } from '../types/constants';
import { components } from '../types/backend-schema';

type User = components["schemas"]["User"];

function CreateGroup() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [quickAddModalVisible, setQuickAddModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupCreatedModalVisible, setGroupCreatedModalVisible] = useState(false);
  const [groupCode, setGroupCode] = useState('');

  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  // Get all users. Should this be for "friends"?
  const { data } = $api.useQuery(
    "get",
    "/api/v1/users/",
    {
      params: {
        query: {
          search: searchQuery
        }
      }
    },
  );

  const handleCreateGroupName = () => {
    if (!groupName.trim()) {
      setError("group name can't be empty");
      return;
    }
    setError('');
    setModalVisible(false);
    setQuickAddModalVisible(true);
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Filter results based on the search query
    // TODO: backend needs to fix this for openAPI
    const filteredResults = data?.results.filter(user => {
      const fullName = `${user.data.first_name} ${user.data.last_name}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });
    const flattenedResults = filteredResults?.map(item => item.data);
    setSearchResults(flattenedResults === undefined ? [] : flattenedResults);
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
      onError: (error) => {
        console.log(error);
      }
    }
  )

  return (
    <>
      <TouchableOpacity
        style={[styles.createButton, isButtonActive && styles.activeButton]}
        onPress={() => {
          setModalVisible(true);
          setIsButtonActive(true);
          setGroupName('');
          setSearchQuery('');
          setSearchResults([]);
        }}
      >
        <Text style={[styles.createButtonText, (modalVisible || quickAddModalVisible || groupCreatedModalVisible) && styles.activeButtonText]}>
          create group
        </Text>
      </TouchableOpacity>

      {/* Modal for entering group code - - way to show content above existing content */}
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
                <Text style={styles.modalTitle}>create group name</Text>
                <TouchableOpacity onPress={() => { setModalVisible(false); setIsButtonActive(false); }}>
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
                  <Text style={styles.buttonText}>enter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Quick add members modal */}
      <Modal animationType="fade" transparent={true} visible={quickAddModalVisible} onRequestClose={() => setQuickAddModalVisible(false)}>
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
                  onPress={async () => {
                    setQuickAddModalVisible(false);
                    setModalVisible(true);
                  }}>
                  <Text style={styles.buttonText}>back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    setQuickAddModalVisible(false);
                    setIsButtonActive(true);
                    setGroupCreatedModalVisible(true);
                    // What?
                    // TODO: is group code generated from backend?
                    // TODO: is group ID generated from backend?
                    // TODO: need to keep track of current user info
                    const s = await handleCreateGroup({
                      body: {
                        name: groupName,
                        location: 'Ann Arbor',
                        members: [...selectedMembers.map(member => member.id)],
                        // quotes_url: '',
                        // images_url: '',
                        // url: '',
                        // num_members: selectedMembers.length,
                        // members_url: '',
                        // logged_in_member_url: '',
                        // join_code: '',
                        // created: '',
                        // achievements_url: '',
                        // id: 0
                      }
                    });
                    setGroupCode(s.data.join_code);
                  }}>
                  <Text style={styles.buttonText}>create group</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Group created confirmation modal */}
      <Modal animationType="fade" transparent={true} visible={groupCreatedModalVisible} onRequestClose={() => setGroupCreatedModalVisible(false)}>
        <View style={styles.fullScreenContainer}>
          <BlurView intensity={7} tint="light" style={styles.fullScreenBlur} />
        </View>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.confirmView}>
              <Feather name="check-circle" size={25} color="green" />
              <Text style={styles.modalText}>group created.</Text>
            </View>
            
            {
              groupCreateLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#44344D" />
                </View>
              ) : (
                  <>
                    <Text style={styles.groupCodeText}>{groupCode}</Text>
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                          setGroupCreatedModalVisible(false);
                          setIsButtonActive(false);
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
                )
            }
          </View>
        </View>
      </Modal>
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
    // marginLeft: 111,
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
});

export default CreateGroup;
