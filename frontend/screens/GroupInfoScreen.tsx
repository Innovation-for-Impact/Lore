import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Navigation, RootStackParamList } from '../types/navigation';

type GroupInfoScreenRouteProp = RouteProp<RootStackParamList, 'GroupInfoScreen'>;

type Props = {
  route: GroupInfoScreenRouteProp;
};

const GroupInfoScreen = ({ route }: Props) => {
  const navigation = useNavigation<Navigation>();
  const { group } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
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
    </View>
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
});

export default GroupInfoScreen;