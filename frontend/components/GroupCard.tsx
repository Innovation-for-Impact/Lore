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
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export type Group = {
  id: number;
  name: string;
  avatar: string;
  num_members: number;
  created: string;
  location: string;
};

type GroupCardProps = {
  group: Group;
};

//individual Cards
const GroupCard = ({ group }: GroupCardProps) => {
  // fixes created date from db
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}`;
  };
  
  return (
    <View style={styles.card}>
      {/* put the image container here*/}
      <View style={styles.imageContainer}>
        <Image source={{ uri: group.avatar }} style={styles.image} />
        
        {/* overlay the member count */}
        <View style={styles.overlay}>
          <Text style={styles.memberCount}>+{group.num_members}</Text>
          <FontAwesome name="users" size={16} color="white" />
        </View>
      </View>

      {/* info for each card */}
      <View style={styles.textContainer}>
        <Text>
          <Text style={styles.title}>{group.name}</Text>
          <Text> | </Text>
          <Text style={styles.subtitle}>created: {formatDate(group.created)}</Text>
        </Text>
        <View style={styles.location}>
          <FontAwesome name="map-marker" size={14} color="#44344D" />
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
    width: screenWidth * 0.9,
    height: screenHeight * 0.27,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '96%',
    height: screenHeight * 0.19,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9CAAC7',
    marginTop: 75,
  },
  overlay: {
    position: 'absolute',
    bottom: -60,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  memberCount: {
    color: 'white',
    marginRight: 5,
    fontWeight: '600',
    fontFamily: 'Work Sans'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Work Sans',
    color: '#44344D',
  },
  subtitle: {
    color: '#9680B6',
    fontSize: 15,
    fontFamily: 'Work Sans',
    fontWeight: '600',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    marginLeft: 5,
    color: '#44344D',
    fontFamily: 'Work Sans'
  },
});

export default GroupCard;
