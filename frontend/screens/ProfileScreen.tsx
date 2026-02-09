import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { ProfileNavigation } from '../navigation/Navigators';
import { $api, infiniteQueryParams } from '../types/constants';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ProfileNavigation>();
  const { user, setUser } = useUser();

  // Get num quotes and num achievements
  const { data: quotes, hasNextPage: quoteNextPage, isFetching: quoteFetching, fetchNextPage: fetchNextQuotePage } = $api.useInfiniteQuery(
    "get",
    "/api/v1/quotes/",
    {},
    infiniteQueryParams
  )

  useEffect(() => {
    if (quoteNextPage && !quoteFetching) {
      fetchNextQuotePage();
    }
  }, [quoteNextPage, quoteFetching])

  const numQuotes = quotes?.pages.flatMap(page => page.results).length || 0;

  const { data: achievements, hasNextPage: achievementsNextPage, isFetching: achievemtnFetching, fetchNextPage: fetchNextAchievementPage } = $api.useInfiniteQuery(
    "get",
    "/api/v1/achievements/",
    {},
    infiniteQueryParams
  )

  useEffect(() => {
    if (achievementsNextPage && !achievemtnFetching) {
      fetchNextAchievementPage();
    }
  }, [achievementsNextPage, achievemtnFetching])

  const numAchievements = achievements?.pages.flatMap(page => page.results).length || 0;

  const { mutateAsync: logout } = $api.useMutation(
    "post",
    "/api/v1/auth/logout/"
  )

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('ProfileEditScreen');
        }}>
          <Ionicons name="settings-sharp" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollBody,
          {
            paddingBottom: insets.bottom + 150
          }
        ]}
      >
        <View style={styles.profileContainer}>
          <View style={styles.avatarBorder}>
            <Image
              source={{ uri: user?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name ?? '')}+${encodeURIComponent(user?.last_name ?? '')}` }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.username}>
            {user?.first_name} {user?.last_name}
          </Text>
        </View>

        <View style={styles.separator} />

        {/* Statistics */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{numQuotes}</Text>
            <Text style={styles.statLabel}>quotes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{numAchievements}</Text>
            <Text style={styles.statLabel}>achievements</Text>
          </View>
        </View>

        {/* Content Cards */}
        <View style={styles.grid}>
          <View style={styles.card}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=300' }} style={styles.cardImg} />
            <Text style={styles.cardLabel}>your quotes</Text>
          </View>
          <View style={styles.card}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=300' }} style={styles.cardImg} />
            <Text style={styles.cardLabel}>your achievements</Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={[styles.solidButton, { backgroundColor: '#5E4B81' }]} onPress={async () => {
            await logout({});
            setUser(null)
          }}>
            <Text style={styles.buttonText}>log out</Text>
          </TouchableOpacity>

        </View>
      </ScrollView >
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5B1E3',
  },
  topHeader: {
    paddingHorizontal: 25,
    alignItems: 'flex-end',
    height: 40,
  },
  scrollBody: {
    backgroundColor: '#9686B8',
    marginTop: 60,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    minHeight: '100%',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -60,
  },
  avatarBorder: {
    backgroundColor: '#9686B8',
    padding: 4,
    borderRadius: 70,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#E1A262',
  },
  username: {
    fontSize: 40,
    color: '#463765',
    fontWeight: '300',
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 35,
    paddingHorizontal: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 50,
    fontWeight: '300',
  },
  statLabel: {
    color: '#463765',
    fontWeight: '700',
    fontSize: 14,
    marginTop: -8,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 8,
    width: width * 0.42,
    alignItems: 'center',
  },
  cardImg: {
    width: '100%',
    height: 110,
    borderRadius: 10,
  },
  cardLabel: {
    marginVertical: 12,
    color: '#777',
    fontSize: 14,
  },

  actionSection: { paddingHorizontal: 25, marginTop: 20 },
  solidButton: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '400' },

  header: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    height: 50,
    marginTop: 10,
  },
  separator: {
    height: 1,               // Thickness of the line
    backgroundColor: '#000', // Black color
    marginHorizontal: 40,    // Spacing from the left and right edges
    marginTop: 20,           // Space between the name and the line
    opacity: 0.8,            // Optional: makes the black a bit softer if desired
  },
});

export default ProfileScreen;
