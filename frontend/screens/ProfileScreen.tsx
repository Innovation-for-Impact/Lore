import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavigation } from '../navigation/Navigators';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ProfileNavigation>();
  const { user, setUser } = useUser();

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollBody,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 150
          }
        ]}
      >

        <View style={styles.profileContainer}>
          <View style={styles.avatarBorder}>
            <Image
              source={{ uri: user?.avatar ?? `https://ui-avatars.com/api/?name=${user?.first_name} ${user?.last_name}` }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.username}>
            {user?.first_name} {user?.last_name}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.capsuleButton} onPress={() => {
            navigation.navigate('ProfileEditScreen')
          }}>
            <Text style={styles.capsuleText}>edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.capsuleButton}>
            <Text style={styles.capsuleText}>friend list</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>15</Text>
            <Text style={styles.statLabel}>quotes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>150</Text>
            <Text style={styles.statLabel}>memories</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>2</Text>
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
            <Text style={styles.cardLabel}>your memories</Text>
          </View>
        </View>

        {/* Full Width Card */}
        <View style={[styles.card, styles.fullCard]}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' }} style={styles.fullCardImg} />
          <Text style={styles.cardLabel}>your achievements</Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={[styles.solidButton, { backgroundColor: '#5E4B81' }]} onPress={() => {
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  capsuleButton: {
    borderWidth: 1.5,
    borderColor: '#FFF',
    borderRadius: 25,
    backgroundColor: '#5F4078',
    paddingVertical: 10,
    width: width * 0.4,
    alignItems: 'center',
  },
  capsuleText: {
    color: '#FFF',
    fontSize: 14,
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
    fontSize: 60,
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
  fullCard: {
    width: width - 40,
    marginHorizontal: 20,
    marginTop: 20,
  },
  cardImg: {
    width: '100%',
    height: 110,
    borderRadius: 10,
  },
  fullCardImg: {
    width: '100%',
    height: 130,
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
});

export default ProfileScreen;
