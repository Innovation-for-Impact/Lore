import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { components } from '../types/backend-schema';
import { RootStackParamList } from '../types/navigation';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const isSmallScreen = screenHeight < 700;        // iPhone SE
const isMediumScreen = screenHeight >= 700 && screenHeight < 900; // iPhone 11/12/13/14/15
// const isLargeScreen = screenHeight >= 900;      // Pro Max / Plus

const cardHeight = Math.max(screenHeight * 0.27, 200); // minimum 200px height
const imageHeight = Math.max(screenHeight * 0.2, 145); // minimum 120px for image

const fontSize = {
  title: isSmallScreen ? 15 : isMediumScreen ? 16 : 17,
  subtitle: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
  location: isSmallScreen ? 13 : isMediumScreen ? 14 : 15,
};

type Group = components["schemas"]["Group"];

type GroupCardProps = {
  group: Group;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

//individual Cards
const GroupCard = ({ group }: GroupCardProps) => {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  // fixes created date from db
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}`;
  };

  function pressGroup() {
    navigation.navigate('GroupInfoScreen', { group });
  }

  return (
    <>
      <TouchableOpacity onPress={pressGroup}>
        <View style={styles.card}>
          {/* image container */}
          <View style={styles.imageContainer}>
            { 
              group.avatar ? (
                <Image source={{ uri: group.avatar }} style={styles.image} />
              ) : <View style={styles.image}/>
            }

            {/* overlay the member count */}
            <View style={styles.overlay}>
              <Text style={styles.memberCount}>+{group.num_members}</Text>
              <FontAwesome name="users" size={isSmallScreen ? 14 : 16} color="white" />
            </View>
          </View>

          {/* info for each card */}
          <View style={styles.textContainer}>
            <Text>
              <Text style={styles.title}>{group.name}</Text>
              <Text style={styles.separator}> | </Text>
              <Text style={styles.subtitle}>created: {formatDate(group.created)}</Text>
            </Text>
            <View style={styles.location}>
              <FontAwesome name="map-marker" size={fontSize.location} color="#44344D" />
              <Text style={styles.locationText}>{group.location}</Text>
            </View>
          </View>

        </View>
      </TouchableOpacity>
    </>
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
    height: cardHeight,
  },
  imageContainer: {
    flex: 1.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: isSmallScreen ? 55 : isMediumScreen ? 65 : 75,
  },
  image: {
    width: '95%',
    height: imageHeight,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9CAAC7',
  },
  overlay: {
    position: 'absolute',
    bottom: isSmallScreen ? -40 : isMediumScreen ? -50 : -60,
    right: 15,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
  },
  memberCount: {
    color: 'white',
    marginRight: 5,
    fontWeight: '600',
    fontFamily: 'Work Sans',
    fontSize: isSmallScreen ? 13 : 14,
  },
  textContainer: {
    flex: 1.4,
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: isSmallScreen ? 45 : isMediumScreen ? 60 : 65,
    gap: isSmallScreen ? 4 : isMediumScreen ? 5 : 6,
  },
  title: {
    fontWeight: '600',
    fontSize: fontSize.title,
    fontFamily: 'Work Sans',
    color: '#44344D',
  },
  separator: {
    color: '#9680B6',
    fontSize: fontSize.subtitle,
  },
  subtitle: {
    color: '#9680B6',
    fontSize: fontSize.subtitle,
    fontFamily: 'Work Sans',
    fontWeight: '600',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    color: '#44344D',
    fontFamily: 'Work Sans',
    fontSize: fontSize.location,
  },
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenBlur: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#44344D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#9680B6',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Work Sans'
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#9680B6',
  },
  modalTitle: {
    fontSize: 20,
    marginRight: 51,
    fontFamily: 'Work Sans'
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});

export default GroupCard;
