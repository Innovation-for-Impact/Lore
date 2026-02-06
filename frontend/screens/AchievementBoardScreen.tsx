import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeStackParamList } from "../navigation/NavigationParams";
import { HomeNavigation } from "../navigation/Navigators";
import AchievementBoardComponent from "./AchievementScreens/AchievementBoardComponent";
import ChallengeListComponent from "./ChallengeScreens/ChallengeListScreen";

enum Tabs {
  achievements = "achievements",
  challenges = "challenges"
};

type Props = {
  route: RouteProp<HomeStackParamList, 'AchievementBoardScreen'>;
};

export const AchievementBoardScreen = ({ route }: Props) => {
  const navigation = useNavigation<HomeNavigation>();
  const insets = useSafeAreaInsets();
  const { group } = route.params;

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.achievements);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
          <AchievementBoardComponent group={group} />
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
