import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CommunityNavigation } from "../navigation/Navigators";
import { useState } from "react";
import AchievementBoardComponent from "./AchievementScreens/AchievementBoardComponent";
import ChallengeListComponent from "./ChallengeScreens/ChallengeListScreen";

enum Tabs {
  achievements = "achievements",
  challenges = "challenges"
};

export const AchievementBoardScreen = () => {
  const navigation = useNavigation<CommunityNavigation>();

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.achievements);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={35} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === Tabs.achievements && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab(Tabs.achievements)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === Tabs.achievements && styles.activeTabText,
            ]}
          >
            achievements
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === Tabs.challenges && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab(Tabs.challenges)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === Tabs.challenges && styles.activeTabText,
            ]}
          >
            challenges
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === Tabs.achievements ? (
          <AchievementBoardComponent />
        ) : (
          <ChallengeListComponent />
        )}
      </View>
    </View>
  );
};

export default AchievementBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#e6e7ff',
    borderRadius: 20,
    marginTop: 16,
    padding: 4,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  activeTabItem: {
    backgroundColor: '#44344D',
  },
  tabText: {
    fontSize: 14,
    color: '#44344D',
    fontFamily: 'Work Sans'
  },
  activeTabText: {
    color: '#ffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
