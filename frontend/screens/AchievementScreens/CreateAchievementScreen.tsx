import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FailureModal } from '../../components/FailureModal';
import { LoadingModal } from '../../components/LoadingModal';
import { SuccessModal } from '../../components/SuccessModal';
import { HomeStackParamList } from '../../navigation/NavigationParams';
import { HomeNavigation } from '../../navigation/Navigators';
import { components } from '../../types/backend-schema';
import { $api } from '../../types/constants';


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
  const [description, setDescription] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState<components["schemas"]["DifficultyEnum"]>(1);

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
      onError: (e) => {
        console.log(e)
        setFailed(true);
      }
    }
  )

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
        difficulty: difficulty,
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>select a difficulty</Text>
        <View style={styles.selectorContainer}>
          {([1, 2, 3] as const).map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setDifficulty(level)}
              style={[
                styles.square,
                difficulty === level && styles.difficultyCircleActive
              ]}
            >
              <Text style={[
                styles.difficultyText,
                difficulty === level && styles.difficultyTextActive
              ]}>
                {level === 1 ? 'EASY' : level === 2 ? 'MED' : 'HARD'}
              </Text>
            </TouchableOpacity>
          ))}
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
    marginBottom: 10,
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

  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: s(16), // Consistent spacing between squares
  },

  square: {
    width: s(100),
    height: s(100),
    backgroundColor: '#F0F0F3',
    borderRadius: s(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D1D6',
    // Neumorphic/Flat elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  difficultyCircleActive: {
    backgroundColor: '#5A3E7A',
  },
  difficultyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A3241',
  },
  difficultyTextActive: {
    color: '#FFF',
  },
});

export default CreateAchievementScreen;
