import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

function CreateGroup() {
  const navigation = useNavigation();

  const navigateToGroupCreation = () => {
    navigation.navigate('GroupCreationScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={navigateToGroupCreation}
      >
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});

export default CreateGroup;
