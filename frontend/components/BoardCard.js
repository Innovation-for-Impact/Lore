import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import placeholder from '../assets/placeholder.png'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

//individual Cards
const BoardCard = ({ board, navigation }) => {
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
                <Image source={board.image ? { uri: board.image } : placeholder} style={styles.image} />
            </View>

            {/* info for each card */}
            <View style={styles.textContainer}>
                <Text>
                <Text style={styles.title}>{board.name}</Text>
                </Text>
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
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default BoardCard;
