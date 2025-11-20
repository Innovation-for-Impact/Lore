import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { $api } from '../types/constants';
import GroupCard from './GroupCard';

const GroupList = () => {
  const emptyGroupData = {
    count: 0,
    next: null,
    previous: null,
    results: []
  };

  const { data: groupData = emptyGroupData, isLoading, isError} = $api.useQuery(
    "get",
    "/api/v1/groups/",
  )

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noGroupsText}>
          Loading groups...
        </Text>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noGroupsText}>
          Error loading groups
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {groupData.results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noGroupsText}>
            you are not in any groups yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupData.results}
          keyExtractor={(item) => String(item.data.id)}
          renderItem={({ item }) => <GroupCard group={item.data} />}
          contentContainerStyle={styles.listContainer} // ensures even spacing
          keyboardShouldPersistTaps="handled" // allows smooth scrolling
          showsVerticalScrollIndicator={false} // this hides the scrollbar for cleaner UI
        />
      )}
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
    fontFamily: 'Work Sans'
   },
   listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, // i added extra padding so the last item in the list is fully visible
   },
   emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  
   noGroupsText:{
    fontSize: 18,
    fontWeight: '600',
    color: '#5F4078',
    marginBottom: 150,
    fontFamily: 'Work Sans'
   },
 });
 
 export default GroupList;
