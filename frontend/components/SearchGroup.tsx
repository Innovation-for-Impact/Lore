// SearchGroup.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


type SearchGroupProps = {
  onChangeQuery?: (query: string) => void;
};

const SearchGroup = ({ onChangeQuery }: SearchGroupProps) => {
  const [query, setQuery] = useState('');

  const handleChangeText = async (text: string) => {
    setQuery(text);
  }

  // const handleChangeText = async (text: string) => {
  //   setQuery(text);
  //
  //   // If the parent component wants the latest query, call onChangeQuery:
  //   if (onChangeQuery) {
  //     onChangeQuery(text);
  //   }
  //
  //   // If you only want to fetch for non-empty queries:
  //   if (!text.trim()) {
  //     return;
  //   }
  //
  //   // Example: call your API endpoint with the typed query
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/api/search?query=${encodeURIComponent(text)}`
  //     );
  //     const data = await response.json();
  //     console.log('Search results:', data.results);
  //   } catch (error) {
  //     console.error('API error:', error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#FFF" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="search friend groups"
        placeholderTextColor="#FFF"
        value={query}
        onChangeText={handleChangeText}
      />
    </View>
  );
};

export default SearchGroup;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9680B6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '60%',
    marginTop: 30,
    alignSelf: 'center',
  },
  icon: {
    marginRight: -19,
  },
  focusedContainer: {
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    color: '#FFF', // White text color
    fontSize: 14,
    textAlign: 'center', 
    fontFamily: 'Work Sans'
  },
});
