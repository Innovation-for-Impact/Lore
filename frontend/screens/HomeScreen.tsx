import { StyleSheet, View } from 'react-native';
import CreateGroup from '../components/CreateGroup';
import GroupList from '../components/GroupList'; // Import GroupList
import JoinGroup from '../components/JoinGroup';
import SearchGroupBar from '../components/SearchGroup';
import { globalStyles } from '../styles/global';

const HomeScreen = () => {
  
  return (
    <View style={[globalStyles.container, styles.mainContainer]}>
      <SearchGroupBar /> 
      
      <View style={styles.buttonContainer}>
        <JoinGroup />
        <CreateGroup />
      </View>
      
      <GroupList />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 35,
    paddingVertical: 25,
  },
});

export default HomeScreen;

