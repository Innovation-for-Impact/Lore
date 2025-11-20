import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Navigation } from '../types/navigation';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const GroupInfoScreen = () => {
  const navigation = useNavigation<Navigation>();

  // Back arrow logic (if you want the arrow at the top left)
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Navigate to to GroupEditScreen
  const handleBack = () => {
    navigation.navigate("GroupEditScreen");
  };

  return (
  );
};

export default GroupInfoScreen;

const styles = StyleSheet.create({
    // TODO: add styling
});
