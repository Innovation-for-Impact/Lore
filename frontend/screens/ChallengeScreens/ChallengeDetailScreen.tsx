import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function ChallengeDetailScreen() {
  const navigation = useNavigation();
  const [hasJoined, setHasJoined] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const participants = [
    "geo johnson",
    "ambrose brown",
    "valentina tran",
    ...(hasJoined ? ["lore admin (me)"] : []),
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color="#2A1E3E" />
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.header}>challenge details</Text>

        {/* Challenge Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>level 1: romeo & juliet</Text>

          <Text style={styles.cardDescription}>
            capture a picture of you belting to a love song or carrying a
            speaker to somebody.
          </Text>

          <View style={{ marginTop: 14 }}>
            <Text style={styles.subText}>
              challenge created by:{" "}
              <Text style={styles.highlight}>LORE ADMIN</Text>
            </Text>

            <Text style={styles.subText}>
              challenge start/end date:{" "}
              <Text style={styles.highlight}>04/03 – 04/07</Text>
            </Text>
          </View>
        </View>

        {/* Completed State */}
        {isCompleted && (
          <View style={styles.completedCard}>
            <Text style={styles.completedTitle}>✔ challenge completed!</Text>

            <Text style={styles.completedSubtitle}>
              come back to explore new options to win.
            </Text>

            <Text style={styles.rewardsHeader}>rewards earned:</Text>
            <Text style={styles.reward}>the rizzler label</Text>
          </View>
        )}

        {/* Participants */}
        <View style={styles.card}>
          <Text style={styles.participantsHeader}>
            participants ({participants.length})
          </Text>

          {participants.map((p, idx) => (
            <Text key={idx} style={styles.participant}>
              • {p}
            </Text>
          ))}
        </View>

        {/* Buttons */}
        {!hasJoined && !isCompleted && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setHasJoined(true)}
          >
            <Text style={styles.actionBtnText}>join challenge</Text>
          </TouchableOpacity>
        )}

        {hasJoined && !isCompleted && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsCompleted(true)}
          >
            <Text style={styles.actionBtnText}>challenge joined</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const PURPLE_BG = "#C3B8E3";
const PURPLE_DARK = "#4D3A68";
const TEXT_DARK = "#2A1E3E";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AFB0E4",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  backBtn: {
    marginBottom: 10,
    width: 40,
  },

  header: {
    fontSize: 30,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 22,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 8,
  },

  cardDescription: {
    fontSize: 14,
    color: TEXT_DARK,
    opacity: 0.75,
    lineHeight: 20,
  },

  subText: {
    fontSize: 12,
    color: TEXT_DARK,
    opacity: 0.75,
    marginBottom: 4,
  },

  highlight: {
    color: PURPLE_DARK,
    fontWeight: "600",
  },

  completedCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 22,
    borderWidth: 2,
    borderColor: "#BBA8E4",
  },

  completedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "green",
    marginBottom: 6,
  },

  completedSubtitle: {
    fontSize: 14,
    color: TEXT_DARK,
    opacity: 0.75,
    marginBottom: 18,
  },

  rewardsHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  reward: {
    fontSize: 16,
    fontStyle: "italic",
    color: TEXT_DARK,
  },

  participantsHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: TEXT_DARK,
  },

  participant: {
    fontSize: 14,
    paddingVertical: 2,
    color: TEXT_DARK,
    opacity: 0.9,
  },

  actionBtn: {
    backgroundColor: "#5D3B73",
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 40,
  },

  actionBtnText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
