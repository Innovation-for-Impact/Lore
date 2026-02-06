import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import badge1 from '../../assets/achievement-badges/Badge_01_activated.png';
import badge2 from '../../assets/achievement-badges/Badge_02_activated.png';
import { useUser } from '../../context/UserContext';
import { HomeNavigation } from '../../navigation/Navigators';
import { $api, Group, infiniteQueryParams } from '../../types/constants';

// --- Mock Data for Achievements ---
const BadgeAssets = {
  ACTIVE: badge1,
  INACTIVE: badge2
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
  <View style={[styles.achievementItemsContainer, { width: containerWidth }]}>
    <View style={[styles.achievementItemContainer, { width: '100%', height: containerHeight, marginTop: containerHeight * 0.15 }]}>
      <View style={[styles.achievementItemHeader, { padding: 10 }]}>
        <Text style={[styles.levelTitleText, { fontSize: containerHeight * 0.18 }]}>
          level {level}: {title}
        </Text>
        <TouchableOpacity onPress={() => console.log(`See more for level ${level}`)}>
          <Text style={[styles.seeMoreText, { fontSize: containerHeight * 0.12 }]}>see more</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.badgeRow, { gap: containerWidth * 0.05 }]}>
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

interface Props {
  group: Group
}

const AchievementBoardComponent = ({ group }: Props) => {
  const navigation = useNavigation<HomeNavigation>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { user } = useUser();

  const containerWidth = screenWidth * 0.9;
  const horizontalPadding = screenWidth * 0.06;

  const { data: achievements, isLoading: loadingAchievements, hasNextPage, isFetching, fetchNextPage } = $api.useInfiniteQuery(
    "get",
    "/api/v1/groups/{loregroup_pk}/achievements/",
    {
      params: {
        path: {
          loregroup_pk: String(group.id)
        }
      }
    },
    infiniteQueryParams
  )

  useEffect(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching])

  $api.useMutation(
    "post",
    "/api/v1/achievements/{achievement_pk}/achievers/"
  )

  const achievementsList = achievements?.pages.flatMap(page => page.results) || [];
  useEffect(() => {
    console.log(achievementsList)
  }, [achievementsList])

  if (loadingAchievements) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noAchievementsText}>
          Loading achivements...
        </Text>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      {/* Header */}
      <Text style={styles.achievementHeader}>
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
        see all the badges you&apos;ve earned & learn how you can create more.
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
        onPress={() => navigation.navigate("CreateAchievementScreen", { group: group })}
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


      {/* TODO: gonna have to redesign the active / inactive stuff */}

      {/* Achievement List */}
      <View style={{ flex: 1, marginTop: scaleHeight(10, screenHeight) }}>
        {
          achievementsList.length === 0 ?
            <View style={styles.emptyContainer}>
              <Text style={styles.noAchievementsText}>
                no achievements
              </Text>
            </View>
            :
            achievementsList.map((achievement) => {
              const asset = achievement.achieved_by.includes(user!.id) ? BadgeAssets.ACTIVE : BadgeAssets.INACTIVE;

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
        }
      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#AFB0E4",
  },
  achievementHeader: {
    fontSize: 32,
    fontWeight: "400",
    color: "black",
    marginLeft: 24,
    fontFamily: "Work Sans",
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

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAchievementsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5F4078',
    marginBottom: 150,
    fontFamily: 'Work Sans'
  },
});

export default AchievementBoardComponent;
