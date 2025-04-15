import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Example dummy data (replace with your API data if needed)
const initialQuotes = [
  { id: '1', text: '“tickle the bottom.”', author: 'geo johnson', timestamp: '1 hour ago' },
  { id: '2', text: '“lost taste in my left eye.”', author: 'ambrose brown', timestamp: '1 hour ago' },
  { id: '3', text: '“wisdom chases you but you are faster.”', author: 'valentina tran', timestamp: '1 hour ago' },
];

const ViewQuotes = () => {
  const navigation = useNavigation();

  // State for quotes array
  const [quotes, setQuotes] = useState([]);
  // Optional: track loading or error states
  const [loading, setLoading] = useState(true);
  // Example: track pinned quote(s). If you only allow one pinned quote, store a single quote ID. If multiple are allowed, store an array.
  const [pinnedQuoteId, setPinnedQuoteId] = useState(null);
  const [pinnedQuoteIds, setPinnedQuoteIds] = useState([]);


  // Simulate fetch or load
  useEffect(() => {
    // Optionally fetch from an API
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      // Simulate network delay
      // await new Promise((resolve) => setTimeout(resolve, 100));
      // Set dummy data
      setQuotes(initialQuotes);
    } catch (err) {
      console.error('Error loading quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reorder quotes so pinned quote is at the top
  // (If you allow multiple pinned, you can sort pinned first, then unpinned.)
  const getOrderedQuotes = () => {
    if (!pinnedQuoteIds || pinnedQuoteIds.length === 0) 
      return quotes;
    const pinned = quotes.filter((q) => pinnedQuoteIds.includes(q.id));
    const unpinned = quotes.filter((q) => !pinnedQuoteIds.includes(q.id));
    return [...pinned, ...unpinned];
  };

  const handlePinPress = (quoteId) => {
    if (pinnedQuoteIds.includes(quoteId)) {
      // Unpin if already pinned
      setPinnedQuoteIds(pinnedQuoteIds.filter(id => id !== quoteId));
    } else {
      // Pin the quote
      setPinnedQuoteIds([...pinnedQuoteIds, quoteId]);
    }
  };

  const renderItem = ({ item }) => {
    const isPinned = pinnedQuoteIds.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('QuoteDetailScreen', { quote: item })}
      >
        {/* Top row with pin icon and timestamp */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => handlePinPress(item.id)}>
            <Text>
              {isPinned ? 
                <AntDesign name="pushpin" size={25} color="#44344D" /> 
              : 
                <AntDesign name="pushpino" size={25} color="#44344D" />
              }
            </Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>

        {/* Quote text in the middle */}
        <Text style={styles.quoteText}>{item.text}</Text>

        {/* Author at the bottom center */}
        <Text style={styles.author}>{item.author}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C57FE" />
      </View>
    );
  }

  const orderedQuotes = getOrderedQuotes();

  return (
    <FlatList
      data={orderedQuotes}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

export default ViewQuotes;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    flexGrow: 1, // ensure it takes full height
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 16,
    width: screenWidth * 0.85,
    minHeight: screenHeight * 0.20,
    justifyContent: 'space-between',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    color: '#6B6B6B',
    fontFamily: 'Work Sans'
  },
  quoteText: {
    fontSize: 24,
    color: '#333333',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'Work Sans'
  },
  author: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'Work Sans'
  },
});
