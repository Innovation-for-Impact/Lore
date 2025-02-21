import React from 'react';
import { StyleSheet } from 'react-native';

// Navigation Styling

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#36528F', // TBD
        justifyContent: 'center',
      
    },
  
    searchBar: {
        borderRadius: 20,
        textAlign: 'center'
    },
  
    settingsIcon: {
      
    },
    
    bottomNavigation: {
      position: 'absolute',
      backgroundColor: '#FFFFFF',
      bottom: 20,
      alignSelf: 'center',
      width: 320, //modify
      height: 57, //modify
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',




      //For IOS:
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 5 //for android
      



    }
  });

  export default styles;