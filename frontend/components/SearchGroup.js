import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchGroupBar = () => {
  return (
    <View style={styles.container}>
      {/* Magnifying glass icon */}
      <Ionicons name="search" size={20} color="#FFFFFF" style={styles.icon} />

      {/* TextInput for typing */}
      <TextInput
        style={styles.input}
        placeholder="search for friend groups"
        placeholderTextColor="#FFFFFF80"
      />
    </View>
  );
};

export default SearchGroupBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFF', 
    fontSize: 16,
  },
});
