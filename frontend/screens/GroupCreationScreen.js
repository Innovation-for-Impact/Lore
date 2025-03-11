import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
        <MaterialIcons name="arrow-back-ios" size={22} color="black" />
      </TouchableOpacity>
      
      <Text>This is the group creation screen!</Text>
    </View>
  );
};

export default GroupCreationScreen;
