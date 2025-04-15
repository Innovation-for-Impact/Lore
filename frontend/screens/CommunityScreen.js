import React from 'react';
import { View, StyleSheet } from 'react-native';
import BoardList from '../components/BoardList';
import { globalStyles } from '../styles/global';

const CommunityScreen = ({ navigation }) => {
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