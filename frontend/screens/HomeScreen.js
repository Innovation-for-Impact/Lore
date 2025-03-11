import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import JoinGroup from '../components/JoinGroup';
import CreateGroup from '../components/CreateGroup';
import { globalStyles } from '../styles/global';


const HomeScreen = ({ navigation }) => {

  return (
    <View style={[globalStyles.container, { justifyContent: 'flex-start', alignItems: 'center' }]}>
      <View style={styles.container}>
        <JoinGroup />
        <CreateGroup />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
  }
});

export default HomeScreen;
