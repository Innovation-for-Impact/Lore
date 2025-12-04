import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ChallengeCreateScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maker, setMaker] = useState("");
  const [dates, setDates] = useState("");

  const [challengeTypeOpen, setChallengeTypeOpen] = useState(false);
  const [achievementOpen, setAchievementOpen] = useState(false);

  const [challengeType, setChallengeType] = useState("");
  const [achievementBadge, setAchievementBadge] = useState("");

  const [posted, setPosted] = useState(false);

  const challengeLevels = [
    "level 1 - starter",
    "level 2 - intermediate",
    "level 3 - expert",
  ];

  const badges = ["dag divas", "campus champ", "rizzzler", "storyteller"];

  const postChallenge = () => {
    setPosted(true);
    setTimeout(() => {
      setPosted(false);
      navigation.goBack();
    }, 1500);
  };

  const goBack = () => navigation.goBack();

  return (
    <View style={styles.fullScreenContainer}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Ionicons name="arrow-back" size={35} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.header}>create challenge</Text>
        <Text style={styles.subheader}>
          build a challenge, pick a badge, and post it to the feed.
        </Text>

        {/* Name */}
        <Text style={styles.fieldLabel}>challenge name</Text>
        <TextInput
          style={styles.input}
          placeholder="insert name for challenge"
          value={name}
          onChangeText={setName}
        />

        {/* Description */}
        <Text style={styles.fieldLabel}>description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="insert description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Maker */}
        <Text style={styles.fieldLabel}>maker name</Text>
        <TextInput
          style={styles.input}
          placeholder="insert name of maker"
          value={maker}
          onChangeText={setMaker}
        />

        {/* Dates */}
        <Text style={styles.fieldLabel}>dates</Text>
        <TextInput
          style={styles.input}
          placeholder="insert start/end dates"
          value={dates}
          onChangeText={setDates}
        />

        {/* Challenge Type Dropdown */}
        <Text style={styles.fieldLabel}>challenge type</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setChallengeTypeOpen(!challengeTypeOpen)}
        >
          <Text style={styles.dropdownValue}>
            {challengeType || "select challenge level"}
          </Text>
          <Ionicons
            name={challengeTypeOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4D3B6B"
          />
        </TouchableOpacity>

        {challengeTypeOpen &&
          challengeLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={styles.dropdownOption}
              onPress={() => {
                setChallengeType(level);
                setChallengeTypeOpen(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{level}</Text>
            </TouchableOpacity>
          ))}

        {/* Achievement Badge Dropdown */}
        <Text style={styles.fieldLabel}>achievement badge</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setAchievementOpen(!achievementOpen)}
        >
          <Text style={styles.dropdownValue}>
            {achievementBadge || "select achievement badge"}
          </Text>
          <Ionicons
            name={achievementOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4D3B6B"
          />
        </TouchableOpacity>

        {achievementOpen &&
          badges.map((badge) => (
            <TouchableOpacity
              key={badge}
              style={styles.dropdownOption}
              onPress={() => {
                setAchievementBadge(badge);
                setAchievementOpen(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{badge}</Text>
            </TouchableOpacity>
          ))}

        {/* Post Button */}
        <TouchableOpacity style={styles.postButton} onPress={postChallenge}>
          <Text style={styles.postButtonText}>post challenge</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Posted Popup */}
      {posted && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={22} color="#4BB543" />
          <Text style={styles.toastText}>challenge posted to feed</Text>
        </View>
      )}
    </View>
  );
};

export default ChallengeCreateScreen;

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#AFB0E4",
  },

  backButton: {
    position: "absolute",
    top: 62,
    left: 15,
    zIndex: 10,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 110,
    paddingBottom: 100,
  },

  header: {
    fontSize: 32,
    fontWeight: "400",
    color: "black",
    marginBottom: 8,
    fontFamily: "Work Sans",
  },

  subheader: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
    marginBottom: 24,
    lineHeight: 22,
    opacity: 0.8,
    fontFamily: "Work Sans",
  },

  fieldLabel: {
    fontSize: 16,
    marginBottom: 6,
    color: "#2A1E3E",
    fontWeight: "600",
    fontFamily: "Work Sans",
  },

  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 18,
    fontFamily: "Work Sans",
  },

  multiline: {
    height: 140,
    textAlignVertical: "top",
  },

  dropdown: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  dropdownValue: {
    fontSize: 15,
    color: "#2A1E3E",
    fontFamily: "Work Sans",
  },

  dropdownOption: {
    backgroundColor: "#EDE8F7",
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
  },

  dropdownOptionText: {
    fontSize: 15,
    color: "#2A1E3E",
    fontFamily: "Work Sans",
  },

  postButton: {
    backgroundColor: "#4D3B6B",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  postButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "Work Sans",
  },

  toast: {
    position: "absolute",
    top: 90,
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  toastText: {
    fontSize: 15,
    color: "#2A1E3E",
    fontFamily: "Work Sans",
  },
});
