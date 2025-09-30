import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import placeholder from '../assets/placeholder.png';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Board = {
  name: string;
  image?: string;
  screen?: string;
};

type BoardCardProps = {
  board: Board;
  navigation: any;
};

const BoardCard: React.FC<BoardCardProps> = ({ board, navigation }) => {
  const handlePress = () => {
    if (board.screen) {
      navigation.navigate(board.screen);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      {/* put the image container here*/}
      <View style={styles.imageContainer}>
        {/* added placeholder for image */}
        <Image
          source={board.image ? { uri: board.image } : placeholder}
          style={styles.image}
        />
      </View>

      {/* info for each card */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{board.name}</Text>
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
    width: screenWidth * 0.85,
    height: screenHeight * 0.23,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '95%',
    height: screenHeight * 0.18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9CAAC7',
  },
  textContainer: {
    flexShrink: 1,
    justifyContent: 'center',
    paddingBottom: 5,
  },
  title: {
    fontWeight: '600',
    fontSize: 20,
    color: '#44344D',
    textAlign: 'center',
    fontFamily: 'Work Sans'
  },
});

export default BoardCard;
