// import React from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';

// const GroupCard = ({ group }) => {
//   return (
//     <View style={styles.card}>
//       <View style={styles.imageContainer}>
//         <Image source={{ uri: group.avatar || "https://placeholder.com" }} style={styles.image} />
//         <View style={styles.overlay}>
//           <Text style={styles.memberCount}>+{group.num_members}</Text>
//           <FontAwesome name="users" size={16} color="white" />
//         </View>
//       </View>

//       <View style={styles.textContainer}>
//         <Text>
//           <Text style={styles.title}>{group.name}</Text>
//           <Text> | </Text>
//           <Text style={styles.subtitle}>
//             Last updated: {group.updated_by || "Unknown"}
//           </Text>
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     card: {
//         backgroundColor: "white",
//         borderRadius: 12,
//         overflow: "hidden",
//         marginVertical: 10,
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 6,
//         elevation: 3,
//     },
//     imageContainer: {
//         position: "relative",
//     },
//     image: {
//         width: "100%",
//         height: 150,
//     },
//     overlay: {
//         position: "absolute",
//         bottom: 10,
//         right: 10,
//         flexDirection: "row",
//         backgroundColor: "rgba(0,0,0,0.6)",
//         padding: 5,
//         borderRadius: 10,
//         alignItems: "center",
//     },
//     memberCount: {
//         color: "white",
//         marginRight: 5,
//         fontWeight: "bold",
//     },
//     textContainer: {
//         padding: 10,
//     },
//     title: {
//         fontWeight: "bold",
//         fontSize: 16,
//     },
//     subtitle: {
//         color: "purple",
//         fontSize: 14,
//     },
// });

// export default GroupCard;

import React from 'react';
 import { View, Text, Image, StyleSheet } from 'react-native';
 import { FontAwesome } from '@expo/vector-icons';
 
 //individual Cards
 const GroupCard = ({ group }) => {
   return (
     <View style={styles.card}>
       {/* put the image container here*/}
       <View style={styles.imageContainer}>
         <Image source={{ uri: group.image }} style={styles.image} />
         
         {/* overlay the member count */}
         <View style={styles.overlay}>
           <Text style={styles.memberCount}>+{group.members}</Text>
           <FontAwesome name="users" size={16} color="white" />
         </View>
       </View>
 
       {/* info for each card */}
       <View style={styles.textContainer}>
         <Text>
           <Text style={styles.title}>{group.name}</Text>
           <Text> | </Text>
           <Text style={styles.subtitle}>last updated: {group.updatedBy}</Text>
         </Text>
         <View style={styles.location}>
           <FontAwesome name="map-marker" size={14} color="gray" />
           <Text style={styles.locationText}>{group.location}</Text>
         </View>
       </View>
     </View>
   );
 };
 
 //Styling for elements
 const styles = StyleSheet.create({
   card: {
     backgroundColor: 'white',
     borderRadius: 12,
     overflow: 'hidden',
     marginVertical: 10,
     shadowColor: '#000',
     shadowOpacity: 0.1,
     shadowRadius: 6,
     elevation: 3,
   },
   imageContainer: {
     position: 'relative', // this makes sure the overlay is positioned relative to the image
   },
   image: {
     width: '100%',
     height: 150,
   },
   overlay: {
     position: 'absolute',
     bottom: 10,
     right: 10,
     flexDirection: 'row',
     backgroundColor: 'rgba(0,0,0,0.6)',
     padding: 5,
     borderRadius: 10,
     alignItems: 'center',
   },
   memberCount: {
     color: 'white',
     marginRight: 5,
     fontWeight: 'bold',
   },
   textContainer: {
     padding: 10,
   },
   title: {
     fontWeight: 'bold',
     fontSize: 16,
   },
   subtitle: {
     color: 'purple',
     fontSize: 14,
   },
   location: {
     flexDirection: 'row',
     alignItems: 'center',
     marginTop: 5,
   },
   locationText: {
     marginLeft: 5,
     color: 'gray',
   },
 });
 
 export default GroupCard;
