import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CommunityNavigation } from "../../navigation/Navigators";


const ChallengeListComponent = () => {
  const navigation = useNavigation<CommunityNavigation>();

  const goToDetail = (id: string) =>
    navigation.navigate('ChallengeDetail', { id });

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

      {/* Header */}
      <Text style={styles.header}>challenges</Text>
      <Text style={styles.subheader}>
        run up on these challenges to earn more badges & save new memories.
      </Text>

      {/* Create Challenge */}
      <TouchableOpacity style={styles.createChallengeButton} onPress={() => navigation.navigate('ChallengeCreate')}>
        <Text style={styles.createChallengeButtonText}>create challenge</Text>
      </TouchableOpacity>

      {/* Challenge List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {challenges.map((ch) => (
          <TouchableOpacity
            key={ch.id}
            style={styles.challengeCard}
            onPress={() => goToDetail(String(ch.id))}
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

export default ChallengeListComponent;

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
    backgroundColor: "#5F4078",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
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
