import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CreateGroup from '../components/CreateGroup';
import GroupList from '../components/GroupList'; // Import GroupList
import JoinGroup from '../components/JoinGroup';
import SearchGroupBar from '../components/SearchGroup';
import { globalStyles } from '../styles/global';

// TODO: Need to update the components
const HomeScreen = () => {
  // const [userJoinedGroup, setUserJoinedGroup] = useState(false);

  // GroupList re-fetches data
  const handleUserJoinedGroup = () => {
    setUserJoinedGroup(prev => !prev);
  };
  
  return (
    <View style={[globalStyles.container, { justifyContent: 'flex-start', alignItems: 'center' }]}>
      <SearchGroupBar /> 
      <View style={styles.container}>
        <JoinGroup  onJoinGroup={handleUserJoinedGroup} />
        <CreateGroup />
      </View>
      <GroupList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -35,
    marginBottom: -25,
  },
  innerContainer: {
    flex: 1, // Allows screen to expand properly
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen;

