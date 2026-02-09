import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { $api } from '../../types/constants';
import badge1 from '../../assets/achievement-badges/Badge_01_activated.png';
import badge2 from '../../assets/achievement-badges/Badge_02_activated.png';
import { SuccessModal } from '../../components/SuccessModal';
import { LoadingModal } from '../../components/LoadingModal';
import { FailureModal } from '../../components/FailureModal';
import { HomeStackParamList } from '../../navigation/NavigationParams';
import { HomeNavigation } from '../../navigation/Navigators';
import { useQuery, useQueryClient } from '@tanstack/react-query';


// -------------------------------
// SCREEN SIZE / SCALING HELPERS
// -------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 390; // iPhone 16 Pro width
const SCALE = SCREEN_WIDTH / BASE_WIDTH;

// small scaling helper
const s = (size: number) => Math.round(size * SCALE);

// universal left/right page padding
const CONTENT_PADDING = SCREEN_WIDTH * 0.06;

type Props = {
  route: RouteProp<HomeStackParamList, 'CreateAchievementScreen'>;
};

const CreateAchievementScreen = ({ route }: Props) => {
  const [title, setTitle] = React.useState('');
  const [index, setIndex] = React.useState(0);
  const [description, setDescription] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const { group } = route.params;

  const navigation = useNavigation<HomeNavigation>();

  const insets = useSafeAreaInsets();

  const queryClient = useQueryClient();
  const { mutateAsync: createAchievement, isPending } = $api.useMutation(
    "post",
    "/api/v1/groups/{loregroup_pk}/achievements/",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: $api.queryOptions("get", "/api/v1/groups/{loregroup_pk}/achievements/", { params: { path: { loregroup_pk: String(group.id) } } }).queryKey });
        setSuccess(true);
      },
      onError: () => {
        setFailed(true);
      }
    }

  )

  // -------------------------------
  // YOUR PNG BADGES HERE
  // -------------------------------
  const badges = [
    { image: badge1 },
    { image: badge2 },
    // add more PNGs if needed
  ];

  const prev = () => setIndex((i) => (i === 0 ? badges.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === badges.length - 1 ? 0 : i + 1));

  const current = badges[index];

  const handleCreateAchievement = () => {
    createAchievement({
      params: {
        path: {
          loregroup_pk: String(group.id)
        }
      },
      body: {
        title: title,
        description: description,
        achieved_by: [],
      }
    })

  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SuccessModal visible={success} setVisible={setSuccess} title='achievement created!' buttonText='close' callback={navigation.goBack} />
      <LoadingModal visible={isPending} title='creating...' />
      <FailureModal visible={failed} title='failed to create achievement' cancelCallback={() => setFailed(false)} tryAgainCallback={handleCreateAchievement} />

      {/* Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigation.goBack}>
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
          value={title}
          onChangeText={setTitle}
          placeholder="insert title for achievement badge"
          placeholderTextColor="rgba(0,0,0,0.5)"
        />
      </View>

      {/* BADGE SELECTOR */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>select a badge cover</Text>

        <View style={styles.card}>

          {/* LEFT ARROW */}
          <TouchableOpacity onPress={prev} style={styles.chevronBtn}>
            <Ionicons name="chevron-back" size={s(36)} color="#3A3241" />
          </TouchableOpacity>

          {/* PNG BADGE */}
          <View style={styles.previewWrap}>
            <Image
              source={current.image}
              style={styles.badgeImage}
            />
          </View>

          {/* RIGHT ARROW */}
          <TouchableOpacity onPress={next} style={styles.chevronBtn}>
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
        ]}
        onPress={handleCreateAchievement}
      >
        <Text style={styles.createBadgeText}>
          create achievement
        </Text>
      </TouchableOpacity>
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
    paddingHorizontal: CONTENT_PADDING - 10,
  },

  achievName: {
    alignSelf: 'flex-start',
    marginLeft: CONTENT_PADDING,
    marginTop: -20,
    marginBottom: -5,
  },

  badgeName: {
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
    width: '100%',
    paddingHorizontal: CONTENT_PADDING,
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: s(16),
    fontWeight: '500',
    color: '#44344D',
    marginBottom: 5,
  },

  card: {
    width: '100%',
    height: s(250),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  chevronBtn: {
    paddingHorizontal: s(12),
    paddingVertical: s(8),
  },

  previewWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeImage: {
    width: s(160),
    height: s(160),
    resizeMode: 'contain',
  },

  descriptionWrapper: {
    paddingHorizontal: CONTENT_PADDING,
    marginTop: 16,
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
    height: 56,
    backgroundColor: '#5A3E7A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: CONTENT_PADDING,
    marginTop: 20,
  },
  createBadgeText: {
    fontFamily: 'Work Sans',
    fontSize: s(20),
    color: '#FFFFFF',
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
    borderColor: '#9680B6',   // <-- purple border
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    transform: [{ translateY: -40 }],
  },

  successIconCircle: {
    width: s(44),       // bigger circle
    height: s(44),
    borderRadius: s(22),
    backgroundColor: '#17990B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },


  successText: {
    fontFamily: 'Work Sans',
    fontSize: s(16),
    color: '#17990B', // <-- green text
  },
});

export default CreateAchievementScreen;
