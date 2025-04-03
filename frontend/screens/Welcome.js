import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import Logo from '../assets/logo-transparent-white.png';

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.img} />

      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}> 
        Connect with friends, run up challenges, & do it for the plot
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegistrationScreen')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5AFE2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  img: {
    width: width * 0.6, // larger logo size
    height: width * 0.25,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 35, // bigger text
    fontWeight: 'bold',
    color: '#5D3B73',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24, // larger subtitle
    color: '#375E64',
    textAlign: 'center',
    marginBottom: 60,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#5D3B73',
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: '100%',
    alignItems: 'center',   // centers the text inside
    justifyContent: 'center', // vertical alignment
  },

  buttonText: {
    color: 'white',
    fontSize: 18, // larger button text
    fontWeight: '600',
  },
});
