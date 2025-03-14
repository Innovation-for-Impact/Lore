import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SearchGroupBar from '../components/SearchGroup';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Home Screen!</Text>
      <SearchGroupBar />
    </View>
  );
};

export default HomeScreen;
