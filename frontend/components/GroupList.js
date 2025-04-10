// import React, { useState, useEffect } from "react";
// import { FlatList, View, ActivityIndicator, Text, StyleSheet } from "react-native";
// import GroupCard from "./GroupCard";

// function GroupList() {
//     const [groups, setGroups] = useState([]); // holds API data
//     const [loading, setLoading] = useState(true); // shows loader
//     const [error, setError] = useState(null); //stores errors

//       //api get request using fetch
//     useEffect(() => { //useEffect is a hook that runs after the first render
//       // https://react.dev/reference/react/useEffect
//         fetch(`/api/v1/groups/`, {
//             method: "GET",
//             credentials: "same-origin",
//             headers: {
//                 "Content-Type": "application/json",
//             }
//         })
//         .then((response) => {
//             if (!response.ok) throw new Error(response.statusText);
//             return response.json();
//         })
//         .then((data) => {
//             console.log("API Response:", data);
//             setGroups(data.results || []); // ensure correct structure
//         })
//         .catch((error) => {
//             console.error("Fetch Error:", error.message);
//             setError(error.message);
//         })
//         .finally(() => setLoading(false));
//     }, []
//     );

//     if (loading) return <ActivityIndicator size="large" color="purple" style={styles.loader} />;
//     if (error) return <Text style={styles.error}>Error: {error}</Text>;

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={groups}
//                 keyExtractor={(item) => item.data.id.toString()} // ensure IDs are strings
//                 renderItem={({ item }) => <GroupCard group={item.data} />} // pass data object
//                 contentContainerStyle={styles.listContainer}
//                 keyboardShouldPersistTaps="handled"
//                 showsVerticalScrollIndicator={false}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     listContainer: {
//         paddingHorizontal: 20,
//         paddingBottom: 120,
//     },
//     loader: {
//         marginTop: 50,
//     },
//     error: {
//         color: "red",
//         textAlign: "center",
//         marginTop: 20,
//     },
// });

// export default GroupList;

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
     num_members: 13, 
     avatar: 'adphi.jpg',
     join_code: '',
     created: '',
   },
   {
     id: '2',
     name: 'lore legends',
     updatedBy: 'chris',
     location: 'ann arbor, usa',
     num_members: 20,
     avatar: 'lore.jpg',
     join_code: '',
     created: '',
   },
   {
     id: '3',
     name: 'skeeps feins',
     updatedBy: 'seobin',
     location: 'ann arbor, usa',
     num_members: 15,
     image: 'skeeps.jpg',
     join_code: '',
     created: '',
   },
   {
     id: '4',
     name: 'home from home',
     updatedBy: 'valeria',
     location: 'new york, usa',
     num_members: 25,
     image: 'home.jpg',
     join_code: '',
     created: '',
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
