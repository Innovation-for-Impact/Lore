import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import GroupCard from './GroupCard';
import * as SecureStore from 'expo-secure-store';
import { $api } from '../types/constants';
// import { components } from '../types/backend-schema';

// type GroupListProps = {
//   userJoinedGroup: string;
// };

// type PaginatedGroup = components["schemas"]["PaginatedGroupList"];
// type Group = components["schemas"]["Group"];

const GroupList = () => {
// const GroupList = ({ userJoinedGroup }: GroupListProps) => {
  // const [groupData, setGroupData] = useState<Group[]>([]);

  // const groupData: PaginatedGroup = {
  //   count: 0,
  //   next: null,
  //   previous: null,
  //   results: [
  //     {
  //       id: 1,
  //       achievements_url: '',
  //       created: '',
  //       images_url: '',
  //       join_code: '',
  //       location: 'Ann arbor',
  //       logged_in_member_url: '',
  //       members: [1, 2],
  //       members_url: '',
  //       name: 'group2',
  //       num_members: 2,
  //       quotes_url: '',
  //       url: '',
  //     }
  //   ]
  // }
  const emptyGroupData = {
    count: 0,
    next: null,
    previous: null,
    results: []
  };

  const { data: groupData = emptyGroupData } = $api.useQuery(
    "get",
    "/api/v1/groups/",
  )


  // TODO: change this
  // if (isLoading) {
  //   return (
  //     // ???
  //     <View style={styles.spinnerContainer}> 
  //       <ActivityIndicator size="large" color="purple" />
  //     </View>
  //   );
  // }

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
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <GroupCard group={item} />}
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
