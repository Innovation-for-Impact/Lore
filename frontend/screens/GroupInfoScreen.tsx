import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Navigation, RootStackParamList } from '../types/navigation';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '../types/constants';
import { ConfirmationModal } from '../components/ConfirmationModal';

type GroupInfoScreenRouteProp = RouteProp<RootStackParamList, 'GroupInfoScreen'>;

type Props = {
  route: GroupInfoScreenRouteProp;
};

const GroupInfoScreen = ({ route }: Props) => {
  const { group } = route.params;
  const [confirmationModal, setConfirmationModal] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigation = useNavigation<Navigation>();

  const { mutateAsync: leaveGroup } = $api.useMutation(
    "delete",
    "/api/v1/groups/{loregroup_pk}/members/{id}/",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get", "/api/v1/groups/"] });
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

  return (
    <>
      <ConfirmationModal title={"leave group?"} left={"cancel"} right={"leave"} visible={confirmationModal} setVisible={setConfirmationModal} callback={handleLeaveGroup} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={35} color="#44344D" />
          </TouchableOpacity>
        </View>
        {group.avatar && (
          <Image source={{ uri: group.avatar }} style={styles.avatar} />
        )}
        <Text style={styles.name}>{group.name}</Text>
        <Text style={styles.info}>Location: {group.location}</Text>
        <Text style={styles.info}>Members: {group.num_members}</Text>
        <Text style={styles.info}>Join Code: {group.join_code}</Text>
        <Text style={styles.info}>Created: {new Date(group.created).toLocaleDateString()}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.leaveButton,
            { backgroundColor: pressed ? "#ff5555" : "red" },
          ]}
          onPress={() => setConfirmationModal(true)}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Leave Group</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 230,
    paddingBottom: 20,
  },
  avatar: {
    width: 350,
    height: 200,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Work Sans',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    fontFamily: 'Work Sans',
    marginBottom: 10,
  },
  leaveButton: {
    borderRadius: 20,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    // optional: shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // optional: elevation for Android
    elevation: 5,
  },
});

export default GroupInfoScreen;
