import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import placeholder from '../assets/placeholder.png';
import { HomeStackParamList } from '../navigation/NavigationParams';
import { HomeNavigation } from '../navigation/Navigators';
import { Group } from '../types/constants';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const isSmallScreen = screenHeight < 700;
const isMediumScreen = screenHeight >= 700 && screenHeight < 900;
const cardHeight = Math.max(screenHeight * 0.23, 200); // minimum 200px height
const imageHeight = Math.max(screenHeight * 0.18, 145); // minimum 120px for image
const fontSize = {
  title: isSmallScreen ? 23 : isMediumScreen ? 24 : 25,
};

export type Board = {
  name: string;
  image?: string;
  screen: keyof HomeStackParamList;
  group: Group
};

const BoardCard = ({ name, screen, image, group }: Board) => {
  const navigation = useNavigation<HomeNavigation>();
  const handlePress = () => {
    navigation.navigate(screen, { group } as never);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>

        {/* image section */}
        <View style={styles.imageContainer}>
          <Image
            source={image ? { uri: image } : placeholder}
            style={styles.image}
          />
        </View>

        {/* title section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{name}</Text>
        </View>

      </View>
    </TouchableOpacity>
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
  textContainer: {
    flex: 1.4,
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: isSmallScreen ? 58 : isMediumScreen ? 61 : 69,
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: fontSize.title,
    fontFamily: 'Work Sans',
    color: '#44344D',
    textAlign: 'center',
  },
});

export default BoardCard;
