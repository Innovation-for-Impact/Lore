import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Modal, View, TextInput, ScrollView, ToastAndroid, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';

function CreateGroup() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [quickAddModalVisible, setQuickAddModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupCreatedModalVisible, setGroupCreatedModalVisible] = useState(false);
  const [groupCode, setGroupCode] = useState(null);
  type User = { id: number; name: string };
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  // API Endpoint (POST)
  const handleCreateGroupName = () => {
    if (!groupName.trim()) {
      setError("group name can't be empty");
      return;
    }
    setError('');

    // FIXME
    // fetch(`/api/v1/groups/create/`, {
    //   method: "POST",
    //   credentials: "same-origin",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ group_name: groupName }),
    // })
    // .then((response) => {
    //     if (!response.ok) throw Error(response.statusText);
    //     return response.json();
    // })
    // .then(() => {
    //   setModalVisible(false);
    //   setGroupName('');
    //   setQuickAddModalVisible(true);
    // })
    // .catch((error) => {
    //     console.error(error);
    // })

    // comment out when finished API endpoint
    setModalVisible(false);
    setGroupName('');
    setQuickAddModalVisible(true);
  }

  // FIXME API Endpoint (GET)
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
  
    // fetch(`/api/v1/users/search/?q=${query}`, {
    //   method: "GET",
    //   credentials: "same-origin",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // .then((response) => {
    //     if (!response.ok) throw Error(response.statusText);
    //     return response.json();
    // })
    // .then(() => {
    //   setSearchResults(data.users || []);
    // })
    // .catch((error) => {
    //     console.error(error);
    //     setSearchResults([]);
    // })

    // testing UI / demo purposes, comment out when done with API
    const fakeDatabase = [
      { id: 1, name: "Tina Vu" },
      { id: 2, name: "Alex Smart" },
      { id: 3, name: "Kara Wong" },
      { id: 4, name: "Arda Edil" },
      { id: 5, name: "Ethan Sun" },
      { id: 6, name: "Aimee Wu" },
      { id: 7, name: "Random Guy" },
      { id: 8, name: "Random Girl" },
    ];
  
    // Filter results based on the search query
    const filteredResults = fakeDatabase.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  
    setSearchResults(filteredResults);
  };

  const handleAddMember = (user: User) => {
    if (!selectedMembers.some((member) => member.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleRemoveMember = (userId: number) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== userId));
  };

  // FIXME API Endpoint: add selected members to group (POST) then GET the groupCode
  const handleCreateGroup = async () => {
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
          style={[styles.createButton, isButtonActive && styles.activeButton]} 
          onPress={() => {
              setModalVisible(true);
              setIsButtonActive(true);
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
                          <TouchableOpacity onPress={() => {setModalVisible(false); setIsButtonActive(false); }}>
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
                                    <Text>{user.name}</Text>
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
                            <Text style={styles.memberText}>{member.name}</Text>
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
                        style={styles.modalButton} 
                        onPress={async () => {
                          setQuickAddModalVisible(false); 
                          setIsButtonActive(true); 
                          setGroupCreatedModalVisible(true); 
                          await handleCreateGroup();
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

            {/* Display group code from GET */}
            {groupCode ? (
              <Text style={styles.groupCodeText}>{groupCode}</Text>
            ) : (
              <Text style={styles.groupCodeText}>ABC123LORE</Text>
            )}
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => {
                  setGroupCreatedModalVisible(false);
                  setIsButtonActive(false); 
                  {groupCode ? (
                    Clipboard.setStringAsync(groupCode)
                  ) : (
                    Clipboard.setStringAsync('ABC123LORE')
                  )}
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
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  createButtonText: {
    fontSize: 15,
    fontFamily: 'Work Sans'
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
    width: '60%',
    marginLeft: 111,
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
