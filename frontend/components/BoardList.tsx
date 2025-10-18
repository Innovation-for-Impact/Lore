import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import BoardCard, { Board } from './BoardCard';
 
 //contains the data about each Board in the list
 const BoardData: Board[] = [
    {
      id: '1',
      name: 'quote board',
      image: '',
      screen: 'QuoteBoardScreen',
    },
    {
      id: '2',
      name: 'memory board',
      image: '',
      screen: 'MemoryBoardScreen',
    },
    {
      id: '3',
      name: 'achievement board',
      image: '',
      screen: 'AchievementBoardScreen',
    },
 ];
 
const BoardList = () => {
  return (
    <View style={styles.container}>
      <FlatList<Board>
        data={BoardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <BoardCard
            id={item.id}
            name={item.name}
            screen={item.screen}
            image={item.image}
          />}
        contentContainerStyle={styles.listContainer} // ensures even spacing
        keyboardShouldPersistTaps="handled" // allows smooth scrolling
        showsVerticalScrollIndicator={false} // this hides the scrollbar for cleaner UI
      />
    </View>
  );
};
 
 const styles = StyleSheet.create({
   container: {
     flex: 1, // allows the component to expand
   },
   listContainer: {
     paddingHorizontal: 20,
     paddingBottom: 120,
   },
 });
 
 export default BoardList;
