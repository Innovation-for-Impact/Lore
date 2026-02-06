import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { queryOptions, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import badge1 from '../../assets/achievement-badges/Badge_01_activated.png';
import badge2 from '../../assets/achievement-badges/Badge_02_activated.png';
import { useUser } from '../../context/UserContext';
import { HomeNavigation } from '../../navigation/Navigators';
import { components } from '../../types/backend-schema';
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

function useRefreshData(groupID: string) {
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  return async () => {
    queryClient.invalidateQueries({ queryKey: $api.queryOptions("get", "/api/v1/groups/{loregroup_pk}/achievements/", { params: { path: { loregroup_pk: groupID } } }).queryKey });
    await queryClient.invalidateQueries({ queryKey: $api.queryOptions("get", "/api/v1/auth/user/").queryKey })
    const options = queryOptions($api.queryOptions("get", "/api/v1/auth/user/"));
    const freshUser = await queryClient.fetchQuery(options);
    if (freshUser) {
      setUser(freshUser);
    }
  }
}

interface AchievementProps {
  groupID: string,
  achievement: components["schemas"]["Achievement"];
}
function Achievement({ groupID, achievement }: AchievementProps) {
  const { user } = useUser();

  const refreshData = useRefreshData(groupID);
  const { mutateAsync: postAchievement, isPending: postAchievementPending } = $api.useMutation(
    "post",
    "/api/v1/achievements/{achievement_pk}/achievers/",
    {
      onSuccess: refreshData,
      onError: () => {
        Alert.alert("Error", "Failed to update achievement");
      }
    }
  )

  const { mutateAsync: deleteAchievement, isPending: deleteAchievementPending } = $api.useMutation(
    "delete",
    "/api/v1/achievements/{achievement_pk}/achievers/{id}/",
    {
      onSuccess: refreshData,
      onError: () => {
        Alert.alert("Error", "Failed to update achievement");
      }
    }
  )

  const achieved = achievement.achieved_by.includes(user!.id);
  const isItemLoading = postAchievementPending || deleteAchievementPending;
  return (
    <TouchableOpacity
      key={achievement.id}
      style={styles.achievementItem}
      disabled={isItemLoading}
      onPress={async () => {
        if (achieved) {
          deleteAchievement({
            params: {
              path: {
                achievement_pk: String(achievement.id),
                id: user!.id
              }
            }
          })
        }
        else {
          postAchievement({
            params: {
              path: {
                achievement_pk: String(achievement.id),
              }
            }
          })
        }
      }
      }>
      <Image
        source={achieved ? BadgeAssets.ACTIVE : BadgeAssets.INACTIVE}
        style={{ width: 60, height: 60, marginRight: 10 }}
        resizeMode="contain"
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.desc}>{achievement.description}</Text>
      </View>
      {
        isItemLoading ?
          <ActivityIndicator size="large" color="purple" />
          :
          achieved ?
            <Ionicons name="checkmark-circle" size={24} color="#5F4078" />
            : <></>
      }
    </TouchableOpacity>
  );
}

interface Props {
  group: Group
}

const AchievementBoardComponent = ({ group }: Props) => {
  const navigation = useNavigation<HomeNavigation>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const horizontalPadding = screenWidth * 0.06;

  const { data: achievements, isLoading: loadingAchievements, hasNextPage, isFetching, fetchNextPage, isError: errorAchievements } = $api.useInfiniteQuery(
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


  const achievementsList = achievements?.pages.flatMap(page => page.results) || [];

  if (loadingAchievements) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noAchievementsText}>
          loading achivements...
        </Text>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  if (errorAchievements) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noAchievementsText}>
          an error occurred
        </Text>
      </View>
    )
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
              return (
                <Achievement key={achievement.id} groupID={String(group.id)} achievement={achievement} />
              )
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
  achievementItem: {
    flexDirection: "row",
    elevation: 2,
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
