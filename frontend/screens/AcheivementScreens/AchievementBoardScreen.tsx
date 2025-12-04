import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, {useEffect, useState} from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Image, 
  ImageSourcePropType, 
  useWindowDimensions 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { $api } from '../../types/constants';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";

type NavProp = StackNavigationProp<RootStackParamList, "AchievementBoardScreen">;

// --- Mock Data for Achievements ---
const BadgeAssets = {
  ACTIVE: require('../../assets/achievement-badges/Badge_01_activated.png'),
  INACTIVE: require('../../assets/achievement-badges/Badge_01_deactivated.png'),
};


// --- Helper for scaling (Updated) --- //
const guidelineBaseWidth = 375; // iPhone 12 baseline width
const guidelineBaseHeight = 812; // iPhone 12 baseline height (or a similar common baseline)

// Scales size based on screen width (for horizontal padding, margin, font size)
const scaleWidth = (size: number, screenWidth: number) => (screenWidth / guidelineBaseWidth) * size;

// Scales size based on screen height (for vertical padding, margin, line height)
const scaleHeight = (size: number, screenHeight: number) => (screenHeight / guidelineBaseHeight) * size;
// ------------------------------------ //

// --- Reusable Components --- //

type BadgeIconProps = {
  source: ImageSourcePropType;
  size: number;
};

const BadgeIcon: React.FC<BadgeIconProps> = ({ source, size }) => (
  <View style={[styles.badgeContainer, { width: size, height: size, borderRadius: size / 2 }]}>
    <Image 
      source={source} 
      style={{ width: '100%', height: '100%' }} 
      resizeMode="contain" 
    />
  </View>
);

type AchievementLevelSectionProps = {
  level: number;
  title: string;
  badges: {
    id: number;
    isEarned: boolean;
    asset: ImageSourcePropType;
  }[];
  containerWidth: number;
  containerHeight: number;
};

const AchievementLevelSection: React.FC<AchievementLevelSectionProps> = ({
  level, title, badges, containerWidth, containerHeight,
}) => (
  <View style={[styles.achievementItemsContainer, { width: containerWidth}]}>
    <View style={[styles.achievementItemContainer, { width: '100%', height: containerHeight, marginTop: containerHeight * 0.15 }]}>
      <View style={[styles.achievementItemHeader, {padding: 10}]}>
        <Text style={[styles.levelTitleText, {fontSize: containerHeight * 0.18}]}>
          level {level}: {title}
        </Text>
        <TouchableOpacity onPress={() => console.log(`See more for level ${level}`)}>
        <Text style={[styles.seeMoreText, {fontSize: containerHeight*0.12}]}>see more</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.badgeRow , {gap: containerWidth * 0.05}]}>
        {badges.map((badge) => (
          <BadgeIcon 
            key={badge.id} 
            source={badge.asset} 
            size={containerHeight * 0.55} 
          />
        ))}
      </View>
    </View>
  </View>
);

const AchievementBoardScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const containerWidth = screenWidth * 0.9;
  const horizontalPadding = screenWidth * 0.06;
  
  type Achievement = {
    id: number;
    title: string;
    description?: string;
    isEarned: boolean;
    asset: ImageSourcePropType;
    achieved_by?: number[];
  };

  const { data: currentUser } = $api.useQuery(
    "get",
    "/api/v1/auth/user/",
    {}
  )

  const { data: groups } = $api.useQuery(
    "get",
    "/api/v1/groups/",
    {
      params: {
        query: {} // you can add page/search if needed
      },
    },
    {
      enabled: !!currentUser,
    }
  )

  const currentGroupId =
    groups?.results.find((group) =>
      Array.isArray(group.members) &&
      group.members.includes(currentUser?.id ?? -1)
    )?.id

  const { data: achievements, isLoading: loadingAchievements } = $api.useQuery(
    "get",
    "/api/v1/achievements/",
    {
      params: {
        query: {
          group_id: currentGroupId,
          achieved_by: currentUser?.id,
        } as any,
      },
    },
    {
      enabled: !!currentUser && !!currentGroupId,
    }
  )

  const goBackToCommunity = () => navigation.goBack();

  if (loadingAchievements) {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
        <Text style={{ color: "white", textAlign: "center", marginTop: 100 }}>
          Loading achievements...
        </Text>
      </SafeAreaView>
    );
  }

  const achievementsList = achievements?.results ?? [];
  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={{ position: 'absolute', top: scaleHeight(30, screenHeight), left: scaleWidth(15, screenWidth), zIndex: 10 }}
        onPress={goBackToCommunity}
      >
        <Ionicons name="arrow-back" size={scaleHeight(65, screenWidth)} color="white" />
      </TouchableOpacity>
    
      {/* Toggle Buttons */}
      <View style={[styles.toggleButtonsContainer, { marginTop: scaleHeight(30, screenHeight) }]}>
        <TouchableOpacity style={[styles.challengesToggle, { width: containerWidth / 2 - 10 }]}>
          <Text style={styles.toggleText}>challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.achievementsToggleActive, { width: containerWidth / 2 - 10 }]}>
          <Text style={styles.toggleTextActive}>achievements</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <Text style={[styles.achievementHeader, { fontSize: scaleWidth(32, screenWidth), marginLeft: horizontalPadding, marginTop: scaleHeight(30, screenHeight) }]}>
        achievements
      </Text>
      <Text 
        style={[
          styles.achievementText, 
          { 
            fontSize: scaleWidth(15, screenWidth), 
            marginLeft: horizontalPadding, 
            marginRight: horizontalPadding,
            marginTop: scaleHeight(10, screenHeight),
            lineHeight: scaleHeight(20, screenHeight),
          }
        ]}
      >
        see all the badges you've earned & learn how you can create more.
      </Text>

      {/* Create Achievement Button */}
      <TouchableOpacity
        style={[
          styles.createAchievementButton,
          {
            marginHorizontal: horizontalPadding,
            marginTop: scaleHeight(15, screenHeight),
            paddingVertical: scaleHeight(15, screenWidth),
            height: scaleHeight(50, screenHeight),
          },
        ]}
        onPress={() => navigation.navigate("CreateAchievementScreen")}
      >
        <Text
          style={[
            styles.createAchievementButtonText,
            { fontSize: scaleWidth(20, screenWidth) },
          ]}
        >
          create achievement
        </Text>
      </TouchableOpacity>

      {/* Achievement List */}
      <View style={{ marginTop: scaleHeight(10, screenHeight) }}>
        {achievementsList.length === 0 ? (
          <>
            {/* Level 1 – all inactive */}
            <AchievementLevelSection
              level={1}
              title="starter"
              badges={[
                { id: 1, isEarned: false, asset: BadgeAssets.INACTIVE },
                { id: 2, isEarned: false, asset: BadgeAssets.INACTIVE },
                { id: 3, isEarned: false, asset: BadgeAssets.INACTIVE },
                { id: 4, isEarned: false, asset: BadgeAssets.INACTIVE },
              ]}
              containerWidth={containerWidth}
              containerHeight={scaleHeight(110, screenHeight)}
            />

            {/* Level 2 – all inactive */}
            <AchievementLevelSection
              level={2}
              title="intermediate"
              badges={[
                { id: 5, isEarned: false, asset: BadgeAssets.INACTIVE },
                { id: 6, isEarned: false, asset: BadgeAssets.INACTIVE },
                { id: 7, isEarned: false, asset: BadgeAssets.INACTIVE },
                { id: 8, isEarned: false, asset: BadgeAssets.INACTIVE },
              ]}
              containerWidth={containerWidth}
              containerHeight={scaleHeight(110, screenHeight)}
            />

            {/* Level 3 – all inactive */}
            <AchievementLevelSection
              level={3}
              title="expert"
              badges={[
                { id: 9, isEarned: false, asset: BadgeAssets.INACTIVE },
                { id: 10, isEarned: false, asset: BadgeAssets.INACTIVE },
                { id: 11, isEarned: false, asset: BadgeAssets.INACTIVE },
                { id: 12, isEarned: false, asset: BadgeAssets.INACTIVE },
              ]}
              containerWidth={containerWidth}
              containerHeight={scaleHeight(110, screenHeight)}
            />
          </>
        ) : (
          // We have achievements from the backend – render them as a flat list
          achievementsList.map((achievement: any) => {
            const userId = currentUser?.id ?? -1;
            const achievedBy = achievement.achieved_by;

            const isEarned =
              userId !== -1 &&
              Array.isArray(achievedBy) &&
              achievedBy.includes(userId);

            const asset = isEarned ? BadgeAssets.ACTIVE : BadgeAssets.INACTIVE;

            return (
              <View key={achievement.id} style={styles.achievementItem}>
                <Image
                  source={asset}
                  style={{ width: 60, height: 60, marginRight: 10 }}
                  resizeMode="contain"
                />
                <View style={{ flexShrink: 1 }}>
                  <Text style={styles.title}>{achievement.title}</Text>
                  <Text style={styles.desc}>{achievement.description}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#AFB0E4",
  },
  toggleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
  },
  challengesToggle: {
    paddingVertical: 8,
    borderRadius: 20,
    borderColor: '#5F4078',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7EEFF', 
    marginRight: 10,
  },
  achievementsToggleActive: {
    paddingVertical: 8,
    borderRadius: 20,
    borderColor: '#5F4078',
    borderWidth: 2,
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
    fontSize: 12,
    fontFamily: 'Work Sans',
  },
  achievementHeader: {
    fontWeight: '400',
    color: 'black',
    fontFamily: 'Work Sans',
  },
  achievementText: {
    fontWeight: '400',
    color: 'black',
    fontFamily: 'Work Sans',
  },
  createAchievementButton: {
    backgroundColor: "#5F4078",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
  },
  createAchievementButtonText: {
    fontWeight: '400',
    color: 'white',
    fontFamily: 'Work Sans',
  },
  achievementItemsContainer: {
    alignSelf: 'center',
  },
  achievementItemContainer: {
    backgroundColor: 'white',
    borderRadius: 11,
  },
  achievementItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTitleText: {
    fontWeight: '400',
    color: '#333',
    fontFamily: 'Work Sans',
  },
  seeMoreText: {
    fontWeight: '700',
    color: '#2E5E76', 
    textDecorationLine: 'underline',
    fontFamily: 'Work Sans',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
    achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
    title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  desc: {
    fontSize: 14,
    color: "#666",
  },
});

export default AchievementBoardScreen;
