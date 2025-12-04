import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ChallengeListScreen = () => {
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();
  const goToAchievements = () => navigation.navigate("AchievementBoardScreen" as never);
  const createChallenge = () => navigation.navigate("CreateChallenge" as never);
  const goToDetail = (id: number) =>
    navigation.navigate("ChallengeDetail" as never, { id } as never);

  const challenges = [
    {
      id: 1,
      title: "romeo & juliet",
      description:
        "capture a picture of you belting to a love song or carrying a speaker to somebody.",
    },
    {
      id: 2,
      title: "sniped",
      description:
        "capture a picture of a friend when they're least expecting it & get their reaction.",
    },
    {
      id: 3,
      title: "find the M",
      description:
        "capture a picture of the hidden M on campus before your friends get to it.",
    },
  ];

  return (
    <View style={styles.fullScreenContainer}>
      {/* Back Button */}
      <TouchableOpacity
        style={{ position: "absolute", top: 62, left: 15, zIndex: 10 }}
        onPress={goBack}
      >
        <Ionicons name="arrow-back" size={35} color="white" />
      </TouchableOpacity>

      {/* Toggle Buttons */}
      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity style={styles.challengesToggleActive}>
          <Text style={styles.toggleTextActive}>challenges</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.achievementsToggle} onPress={goToAchievements}>
          <Text style={styles.toggleText}>achievements</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <Text style={styles.header}>challenges</Text>
      <Text style={styles.subheader}>
        run up on these challenges to earn more badges & save new memories.
      </Text>

      {/* Create Challenge */}
      <TouchableOpacity style={styles.createChallengeButton} onPress={createChallenge}>
        <Text style={styles.createChallengeButtonText}>create challenge</Text>
      </TouchableOpacity>

      {/* Challenge List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {challenges.map((ch) => (
          <TouchableOpacity
            key={ch.id}
            style={styles.challengeCard}
            onPress={() => goToDetail(ch.id)}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.challengeTitle}>
                level {ch.id}: {ch.title}
              </Text>
              <Text style={styles.seeMore}>see more</Text>
            </View>

            <Text style={styles.challengeDescription}>{ch.description}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

export default ChallengeListScreen;

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#AFB0E4",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Toggle Buttons
  toggleButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 103,
  },

  challengesToggleActive: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#5F4078",
    width: 166,
    height: 32,
    backgroundColor: "#44344D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  achievementsToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#5F4078",
    width: 166,
    height: 32,
    backgroundColor: "#F7EEFF",
    justifyContent: "center",
    alignItems: "center",
  },

  toggleText: {
    color: "#5F4078",
    fontWeight: "400",
    fontSize: 12,
    fontFamily: "Work Sans",
  },

  toggleTextActive: {
    color: "white",
    fontWeight: "400",
    fontSize: 12,
    fontFamily: "Work Sans",
  },

  header: {
    fontSize: 32,
    fontWeight: "400",
    color: "black",
    marginTop: 54,
    marginLeft: 24,
    fontFamily: "Work Sans",
  },

  subheader: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
    marginTop: 11,
    marginLeft: 24,
    lineHeight: 24,
    fontFamily: "Work Sans",
  },

  createChallengeButton: {
    backgroundColor: "#5D3B73",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 20,
  },

  createChallengeButtonText: {
    fontSize: 22,
    fontWeight: "400",
    color: "white",
    fontFamily: "Work Sans",
  },

  challengeCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  challengeTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2A1E3E",
    fontFamily: "Work Sans",
  },

  seeMore: {
    color: "#5F4078",
    fontWeight: "600",
    fontFamily: "Work Sans",
  },

  challengeDescription: {
    color: "#2A1E3E",
    opacity: 0.7,
    fontFamily: "Work Sans",
  },
});
