import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { globalStyles } from '../styles/global';

const GroupCreationScreen = () => {
  const navigation = useNavigation();

  const goBackToHome = () => {
    navigation.goBack();
  };

  return (
    <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 40, left: 10 }} 
        onPress={goBackToHome}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      
      <Text>This is the group creation screen!</Text>
    </View>
  );
};

export default GroupCreationScreen;
