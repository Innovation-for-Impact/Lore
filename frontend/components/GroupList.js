import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import GroupCard from './GroupCard'; //import the group card component

//contains the data about each group in the list
const groupData = [
  {
    id: '1',
    name: 'adphi girls',
    updatedBy: 'tanya',
    location: 'tokyo, japan',
    members: 13,
    image: 'adphi.jpg',
  },
  {
    id: '2',
    name: 'lore legends',
    updatedBy: 'chris',
    location: 'ann arbor, usa',
    members: 20,
    image: 'lore.jpg',
  },
  {
    id: '3',
    name: 'skeeps feins',
    updatedBy: 'seobin',
    location: 'ann arbor, usa',
    members: 15,
    image: 'skeeps.jpg',
  },
  {
    id: '4',
    name: 'home from home',
    updatedBy: 'valeria',
    location: 'new york, usa',
    members: 25,
    image: 'home.jpg',
  },
];

const GroupList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={groupData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GroupCard group={item} />}
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 10,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, // i added extra padding so the last item in the list is fully visible
  },
});

export default GroupList;
