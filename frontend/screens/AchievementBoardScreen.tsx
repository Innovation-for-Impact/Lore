import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

const AchievementBoardScreen = () => {
  const [selected, setSelected] = useState(true);
  const navigation = useNavigation();

  const goBackToCommunity = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 30, left: 15, zIndex: 10 }}
        onPress={goBackToCommunity}
      >
        <Ionicons name="arrow-back" size={35} color="white" />
      </TouchableOpacity>
      <View style = {styles.topBar}>
        <TouchableOpacity style = {styles.topButton}>
          <Text style = {styles.topButtonText}>challenges</Text>
        </TouchableOpacity >
        <TouchableOpacity style = {styles.topButton}>
          <Text style = {styles.topButtonText} >achievements</Text>
        </TouchableOpacity>
      </View>
      <Text style = {styles.title}>achievements</Text>
      <Text style = {styles.subtitle}>see all the badges you've earned & learn how you can earn more.</Text>
      <TouchableOpacity style = {styles.buttonStyle}>
        <Text style = {styles.buttonText}>create achievement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#AFB0E4",
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 20,

  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  topButtonText: {
    fontFamily: "Work Sans",
    color: "#5F4078"
  },
  topButton: {
    backgroundColor: "#F7EEFF",
    borderRadius: 15,
    padding: 5,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: "#5F4078",
  },
  title: {
    marginTop: 20,
    fontSize: 25,
    fontFamily: "Work Sans",
    textAlign: "left"
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Work Sans",
    marginTop: 10
  },
  buttonStyle: {
    backgroundColor: "#5F4078",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center"
  },
  buttonText: {
    fontFamily: "Work Sans",
    color: "white",
    fontSize: 20,

  }
});

export default AchievementBoardScreen;
