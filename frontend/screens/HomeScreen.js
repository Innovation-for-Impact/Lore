import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GroupList from '../components/GroupList'; // import the GroupList

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <GroupList /> // Add GroupList component
    </View>
  );
};

//styles i added for testing on homescreen:

const styles = StyleSheet.create({
  container: {
    flex: 1, // allows screen to expand properly
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen;
