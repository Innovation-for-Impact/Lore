import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';


// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

const AchievementBoardScreen = () => {
  const [text, onChangeText] = React.useState('');
  const [index, setIndex] = React.useState(0);
  const [description, setDescription] = React.useState('');
  const navigation = useNavigation();
  const [submitted, setSubmitted] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);  

  // You can swap these for local images later; keeping it icon-based for now
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
  // you can add validation here later
  setSubmitted(true);
  setShowSuccess(true);

  // hide the alert after a bit
  setTimeout(() => setShowSuccess(false), 2000);
};

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
      <TouchableOpacity
        onPress={goBackToCommunity}
      >
        <Ionicons name="arrow-back" size={35} color="white" />
      </TouchableOpacity>
      </View>

    <View style={styles.achievName}>
      <Text style={{fontSize: 30, fontFamily: 'Work Sans'}}>create achievement</Text>
    </View>

    <View style={styles.badgeName}>
      <TextInput
      style={styles.badgeNameInput}
      value={text}
      onChangeText={onChangeText}
      placeholder='insert name for achievement badge'
      placeholderTextColor={'rgba(0,0,0,0.5)'}
     
      />


    </View>

    {/* Badge selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>select a badge cover</Text>

        <View style={styles.card}>
          <TouchableOpacity onPress={prev} style={styles.chevronBtn} hitSlop={10} accessibilityLabel="Previous badge">
            <Ionicons name="chevron-back" size={36} color="#3A3241" />
          </TouchableOpacity>

          <View style={styles.previewWrap}>
            {/* Outer circle */}
            <View style={[styles.badgeOuter, { backgroundColor: current.bg }]}>
              {/* Inner ring */}
              <View style={[styles.badgeInner, { backgroundColor: current.ring }]}>
                <Ionicons name={current.icon} size={72} color="white" />
              </View>

              {/* Small ribbon */}
              <View style={styles.ribbon} />
            </View>
          </View>

          <TouchableOpacity onPress={next} style={styles.chevronBtn} hitSlop={10} accessibilityLabel="Next badge">
            <Ionicons name="chevron-forward" size={36} color="#3A3241" />
          </TouchableOpacity>
        </View>
      </View>

       {/* Description box */}
  <View style={styles.descriptionWrapper}>
    <TextInput
      style={styles.descriptionInput}
      value={description}
      onChangeText={setDescription}
      multiline
      placeholder="insert description"
      placeholderTextColor="rgba(0,0,0,0.5)"
      textAlignVertical="top"   // keeps text at the top, like a text area
    />
  </View>

  {/* Create Badge Button */}
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


      {/* Spacer to keep content centered nicely */}
      <View style={{ height: 24 }} />

      {showSuccess && (
  <View style={styles.successOverlay}>
    <View style={styles.successCard}>
      <View style={styles.successIconCircle}>
        <Ionicons name="checkmark" size={22} color="#4CAF50" />
      </View>
      <Text style={styles.successText}>achievement badge posted!</Text>
    </View>
  </View>
)}

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#AFB0E4",
    flex: 1
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  achievName: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    alignSelf: 'flex-start',
    marginLeft: 25
  },
  badgeName: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
 badgeNameInput: {
  width: 348,
  height: 60,
  backgroundColor: "#FFFFFF",
  borderRadius: 10,
  borderWidth: 2,
  borderColor: "rgba(0,0,0,0.5)",
  paddingTop: 13,
  paddingBottom: 13,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 16,
  fontFamily: "Work Sans",
  marginTop: 12
},

  section: {
    flexDirection: 'column',
    marginTop: 8,
    alignItems: 'center', // centers horizontally
    paddingHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#44344D',
    marginBottom: 5,
    alignSelf: 'flex-start', 
  },

  card: {
    alignSelf: 'center',
    width: 353,
    height: 250,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  chevronBtn: {
    padding: 8,
  },
  previewWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeOuter: {
    width: 130,
    height: 130,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInner: {
    width: 80,
    height: 80,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  ribbon: {
    position: 'absolute',
    bottom: -8,
    width: 50,
    height: 34,
    backgroundColor: '#F0753E',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },

  descriptionWrapper: {
    alignItems: 'center',
    marginTop: 16,
  },
  descriptionInput: {
    width: 353,
    height: 129,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)', // 50% black like in Figma
    backgroundColor: '#FFFFFF',
    paddingTop: 13,
    paddingRight: 12,
    paddingBottom: 13,
    paddingLeft: 12,
    fontSize: 14,
  },
  createBadgeButton: {
  width: 353,
  height: 56,
  backgroundColor: '#5A3E7A',
  borderRadius: 10,         // sharper corners, like your Figma
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  marginTop: 20,
},

createBadgeButtonDisabled: {
  opacity: 0.8,
},

createBadgeText: {
  fontFamily: 'Work Sans',
  fontSize: 22,
  color: '#FFFFFF',
  fontWeight: '400',
  lineHeight: 28,
  letterSpacing: 0.4,
},

successOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,   // makes sure it appears above everything
},

successCard: {
  width: 328,
  minHeight: 76,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#64C466',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,

  // this line moves it UP from exact center of the phone
  transform: [{ translateY: -40 }],  // try -40; change to -50/-60 if you want higher
},


successIconCircle: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#E7F7EB',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

successText: {
  fontFamily: 'Work Sans',
  fontSize: 16,
  color: '#64C466',
},

});

export default AchievementBoardScreen;
