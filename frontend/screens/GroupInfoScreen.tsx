import { Ionicons, Feather } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Platform, ToastAndroid, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Navigation, RootStackParamList } from '../types/navigation';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '../types/constants';
import { ConfirmationModal } from '../components/ConfirmationModal';
import * as Clipboard from 'expo-clipboard';

type GroupInfoScreenRouteProp = RouteProp<RootStackParamList, 'GroupInfoScreen'>;

type Props = {
  route: GroupInfoScreenRouteProp;
};

const GroupInfoScreen = ({ route }: Props) => {
  const initialGroup = route.params.group;
  const [confirmationModal, setConfirmationModal] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigation = useNavigation<Navigation>();

  // fetch most recent group data
  const { data: group = initialGroup } = $api.useQuery(
    "get",
    "/api/v1/groups/{id}/",
    {
      params: {
        path: {
          id: String(initialGroup.id)
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
    navigation.navigate('EditGroupScreen', { group: group });
  };

  return (
    <>
      <ConfirmationModal title={"leave group?"} left={"cancel"} right={"leave"} visible={confirmationModal} setVisible={setConfirmationModal} callback={handleLeaveGroup} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={35} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleEdit}
          >
            <Feather name="edit" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{group.name}</Text>
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
        <Pressable
          style={({ pressed }) => [
            styles.leaveButton,
            { backgroundColor: pressed ? "#ff5555" : "red" },
          ]}
          onPress={() => setConfirmationModal(true)}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>leave group</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 0.85,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#AFB0E4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
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
    fontWeight: '600',
    fontFamily: 'Work Sans',
    textAlign: 'center',
    marginBottom: 20,
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
});

export default GroupInfoScreen;
