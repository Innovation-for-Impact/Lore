import React from 'react';
import { StyleSheet, View } from 'react-native';
import BoardList from '../components/BoardList';
import { globalStyles } from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types/navigation';

const CommunityScreen = () => {
  const navigation = useNavigation<Navigation>();

  return (
    <View style={[globalStyles.container, { justifyContent: 'flex-start', alignItems: 'center' }]}>
      <View style={styles.container}>
      </View>
      <BoardList style={styles.innerContainer} navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
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

export default CommunityScreen;
