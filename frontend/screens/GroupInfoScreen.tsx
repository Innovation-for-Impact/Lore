import { Feather, Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useUser } from '../context/UserContext';
import { HomeStackParamList } from '../navigation/NavigationParams';
import { HomeNavigation } from '../navigation/Navigators';
import { $api } from '../types/constants';
import BoardCard from '../components/BoardCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  route: RouteProp<HomeStackParamList, 'GroupInfoScreen'>;
};

const GroupInfoScreen = ({ route }: Props) => {
  const initialGroup = route.params.group;
  const [confirmationModal, setConfirmationModal] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigation = useNavigation<HomeNavigation>();

  // fetch most recent group data
  const { data: group = initialGroup } = $api.useQuery(
    "get",
    "/api/v1/groups/{id}/",
    {
      params: {
        path: {
          id: initialGroup.id
        }
      }
    }
  );

  const { mutateAsync: leaveGroup } = $api.useMutation(
    "delete",
    "/api/v1/groups/{loregroup_pk}/members/{id}/",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: $api.queryOptions("get", "/api/v1/groups/").queryKey });
      }
    }
  )

  async function handleLeaveGroup() {
    leaveGroup({
      params: {
        path: {
          id: user!.id,
          loregroup_pk: String(group.id)
        }
      }
    })
    navigation.goBack();
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('GroupEditScreen', { group: group });
  };

  const insets = useSafeAreaInsets();
  return (
    <>
      <ConfirmationModal title={"leave group?"} left={"cancel"} right={"leave"} visible={confirmationModal} setVisible={setConfirmationModal} callback={handleLeaveGroup} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 150,
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={35} color="white" />
          </TouchableOpacity>

          <Text style={styles.name}>{group.name}</Text>
          <TouchableOpacity
            onPress={handleEdit}
          >
            <Feather name="edit" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentWrapper}>
          {group.avatar ? (
            <Image source={{ uri: group.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Feather name="image" size={40} color="#9680B6" />
            </View>
          )}
          <Text style={styles.info}>location: {group.location}</Text>
          <Text style={styles.info}>members: {group.num_members}</Text>
          <View style={styles.codeRow}>
            <Text style={styles.info}>join code: {group.join_code}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => {
                Clipboard.setStringAsync(group.join_code);
                if (Platform.OS === 'android') {
                  ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
                } else {
                  Alert.alert('Text copied to clipboard!');
                }
              }}
            >
              <Ionicons name="clipboard-outline" size={18} />
            </TouchableOpacity>
          </View>
          <Text style={styles.info}>created: {new Date(group.created).toLocaleDateString()}</Text>
        </View>
        <View style={styles.cardWrapper}>
          <BoardCard name='quote board' screen='QuoteBoardScreen' group={group} />
          <BoardCard name='achievement board' screen='AchievementBoardScreen' group={group} />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.leaveButton,
            { backgroundColor: pressed ? "#ff5555" : "red" },
          ]}
          onPress={() => setConfirmationModal(true)}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>leave group</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#AFB0E4',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  avatar: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  placeholderAvatar: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#9680B6',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Work Sans',
    textAlign: 'center',
    color: '#44344D',
  },
  info: {
    fontSize: 16,
    fontFamily: 'Work Sans',
    marginBottom: 10,
  },
  leaveButton: {
    borderRadius: 10,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
    width: '100%',
  },
  copyButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default GroupInfoScreen;
