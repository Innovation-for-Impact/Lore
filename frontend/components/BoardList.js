import React from 'react';
 import { FlatList, View, StyleSheet, useNavigation } from 'react-native';
 import BoardCard from './BoardCard';
 
 //contains the data about each Board in the list
 const BoardData = [
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
 
 const BoardList = ({ navigation }) => {

    return (
        <View style={styles.container}>
        <FlatList
            data={BoardData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BoardCard board={item} navigation={navigation} />}
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
