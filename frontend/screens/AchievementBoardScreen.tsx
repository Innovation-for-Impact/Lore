import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { TextInput } from 'react-native-gesture-handler';


// -------------------------------
// SCREEN SIZE / SCALING HELPERS
// -------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 390; // iPhone 16 Pro width
const SCALE = SCREEN_WIDTH / BASE_WIDTH;

// small scaling helper (keeps size reasonable)
const s = (size: number) => Math.round(size * SCALE);

// shared horizontal padding to align everything
const CONTENT_PADDING = SCREEN_WIDTH * 0.06;



const AchievementBoardScreen = () => {
  const [text, onChangeText] = React.useState('');
  const [index, setIndex] = React.useState(0);
  const [description, setDescription] = React.useState('');
  const navigation = useNavigation();
  const [submitted, setSubmitted] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const badges = [
    { bg: '#FFD46A', ring: '#E7B85A', icon: 'medal' as const },
    { bg: '#7AD1FF', ring: '#5DB7E6', icon: 'planet' as const },
    { bg: '#B0EFA5', ring: '#8CD07F', icon: 'leaf' as const },
    { bg: '#F6A6C9', ring: '#D57AA4', icon: 'sparkles' as const },
  ];

  const prev = () => setIndex((i) => (i === 0 ? badges.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === badges.length - 1 ? 0 : i + 1));
  const goBackToCommunity = () => navigation.goBack();

  const current = badges[index];

  const handleCreateBadge = () => {
    setSubmitted(true);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <View style={styles.container}>
      
      {/* Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBackToCommunity}>
          <Ionicons name="arrow-back" size={s(35)} color="white" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.achievName}>
        <Text style={{ fontSize: s(23), fontFamily: 'Work Sans' }}>
          create achievement
        </Text>
      </View>

      {/* Name Input */}
      <View style={styles.badgeName}>
        <TextInput
          style={styles.badgeNameInput}
          value={text}
          onChangeText={onChangeText}
          placeholder="insert name for achievement badge"
          placeholderTextColor="rgba(0,0,0,0.5)"
        />
      </View>

      {/* BADGE SELECTOR */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>select a badge cover</Text>

        <View style={styles.card}>
          <TouchableOpacity
            onPress={prev}
            style={styles.chevronBtn}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={s(36)} color="#3A3241" />
          </TouchableOpacity>

          <View style={styles.previewWrap}>
            <View style={[styles.badgeOuter, { backgroundColor: current.bg }]}>
              <View
                style={[styles.badgeInner, { backgroundColor: current.ring }]}
              >
                <Ionicons name={current.icon} size={s(72)} color="white" />
              </View>

              <View style={styles.ribbon} />
            </View>
          </View>

          <TouchableOpacity
            onPress={next}
            style={styles.chevronBtn}
            hitSlop={10}
          >
            <Ionicons name="chevron-forward" size={s(36)} color="#3A3241" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Description Box */}
      <View style={styles.descriptionWrapper}>
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="insert description"
          placeholderTextColor="rgba(0,0,0,0.5)"
          textAlignVertical="top"
        />
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={[
          styles.createBadgeButton,
          submitted && styles.createBadgeButtonDisabled,
        ]}
        onPress={handleCreateBadge}
        disabled={submitted}
      >
        <Text style={styles.createBadgeText}>
          {submitted ? 'badge created' : 'create badge'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />

      {/* Success Toast */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={s(22)} color="#4CAF50" />
            </View>
            <Text style={styles.successText}>achievement badge posted!</Text>
          </View>
        </View>
      )}

    </View>
  );
};


// -------------------------------
// RESPONSIVE STYLES
// -------------------------------
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#AFB0E4",
    flex: 1,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(12),
    paddingHorizontal: CONTENT_PADDING - 10
  },

  achievName: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
    alignSelf: 'flex-start',
    marginLeft: CONTENT_PADDING,
    marginBottom: -5,
  },

  badgeName: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: CONTENT_PADDING,
    width: '100%',
  },

  badgeNameInput: {
    width: '100%',
    height: s(60),
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    fontSize: s(16),
    fontFamily: 'Work Sans',
    marginTop: 12,
  },

  section: {
    flexDirection: 'column',
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: CONTENT_PADDING,
  },

  sectionTitle: {
    fontSize: s(16),
    fontWeight: '500',
    color: '#44344D',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },

  card: {
    alignSelf: 'stretch',
    width: '100%',
    height: s(250),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  chevronBtn: {
    padding: s(8),
  },

  previewWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeOuter: {
    width: s(130),
    height: s(130),
    borderRadius: s(130) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeInner: {
    width: s(80),
    height: s(80),
    borderRadius: s(80) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },

  ribbon: {
    position: 'absolute',
    bottom: -s(8),
    width: s(50),
    height: s(34),
    backgroundColor: '#F0753E',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },

  descriptionWrapper: {
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: CONTENT_PADDING,
    width: '100%',
  },

  descriptionInput: {
    width: '100%',
    height: s(129),
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    fontSize: s(14),
  },

  createBadgeButton: {
  height: 56,                     // keep a nice fixed height
  backgroundColor: '#5A3E7A',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',

  // instead of width: '100%' + padding,
  // we stretch and add margin so the purple
  // background matches the text fields
  alignSelf: 'stretch',
  marginHorizontal: CONTENT_PADDING,
  marginTop: 20,
},

createBadgeButtonDisabled: {
  opacity: 0.8,
},

createBadgeText: {
  fontFamily: 'Work Sans',
  fontSize: 20,                   // a bit smaller than before
  color: '#FFFFFF',
  fontWeight: '400',
},


  successOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  successCard: {
    width: '85%',
    minHeight: s(76),
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#64C466',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    transform: [{ translateY: -40 }],
  },

  successIconCircle: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: '#E7F7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  successText: {
    fontFamily: 'Work Sans',
    fontSize: s(16),
    color: '#64C466',
  },
});

export default AchievementBoardScreen;
