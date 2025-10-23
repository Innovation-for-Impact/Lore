import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AchievementBoardScreen = () => {
  const navigation = useNavigation();

  const goBackToCommunity = () => {
    navigation.goBack();
  };

  const handleCreateAchievement = () => {
    // navigation.navigate('CreateAchievement');
    //TODO: Implement navigation to Create Achievement Screen
  };

  const toggleToChallenges = () => {
    //naviagation.navigate('ChallengeScreen');
  };

  return (
    <View style={styles.fullScreenContainer}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 62, left: 15, zIndex: 10 }}
        onPress={goBackToCommunity}
      >
        <Ionicons name="arrow-back" size={35} color="white" />
      </TouchableOpacity>
    
      {/* Toggle Buttons */}
      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity 
          style={styles.challengesToggle}
          onPress={toggleToChallenges}
          >
          <Text style={styles.toggleText}>challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.achievementsToggleActive}>
          <Text style={styles.toggleTextActive}>achievements</Text>
        </TouchableOpacity>
      </View>

      {/*Achievement text*/}
      <Text style={styles.achievementHeader}>achievements</Text>
      <Text style={styles.achievementText}>
        see all the badges you've earned & learn how you can create more.
      </Text>
      {/*Create Achievement Button*/}
      <TouchableOpacity 
        style={styles.createAchievementButton}
        onPress={handleCreateAchievement}
      >
        <Text style={styles.createAchievementButtonText}>create achievement</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Achievement items would go here */}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#AFB0E4", // Main background color
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Make space for the bottom nav bar
  },
  //--------Toggle Buttons Styles--------//
  toggleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 103,
  },
  challengesToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: '#5F4078',
    borderWidth: 2,
    width: 166,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7EEFF', 
    marginRight: 10,
  },
  achievementsToggleActive: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: '#5F4078',
    borderWidth: 2,
    width: 166,
    height: 32,
    backgroundColor: '#4D3B6B', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    color: '#5F4078',
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Work Sans',
  },
  toggleTextActive: {
    color: 'white',
    fontWeight: '400',
    fontFamily: 'Work Sans',
    fontSize: 12,
  },
  //--------Achievment text Styles--------//
  achievementHeader: {
    fontSize: 32,
    fontWeight: '400',
    color: 'black',
    marginTop: 54,
    marginLeft: 24,
    fontFamily: 'Work Sans',
  },
  achievementText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
    marginTop: 11,
    marginLeft: 24,
    lineHeight: 24,
    fontFamily: 'Work Sans',
  },
  //-------Create Achievement Button Style-------//
  createAchievementButton: {
    backgroundColor: "#5F4078",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 11,
    marginLeft: 24,
    marginRight: 24,
    paddingVertical: 17,
  },
  createAchievementButtonText: {
    fontSize: 22,
    fontWeight: '400',
    color: 'white',
    lineHeight: 28,
    fontFamily: 'Work Sans',
  },
});

export default AchievementBoardScreen;
