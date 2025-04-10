import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

  // Simulate fetch or load
  useEffect(() => {
    // Optionally fetch from an API
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    if (!pinnedQuoteId) return quotes;
    // Move the pinned quote to the front
    const pinnedQuote = quotes.find((q) => q.id === pinnedQuoteId);
    if (!pinnedQuote) return quotes; // if pinned quote not found, just return original
    // Filter out pinned quote from the rest
    const rest = quotes.filter((q) => q.id !== pinnedQuoteId);
    // Return pinned quote first, then the rest
    return [pinnedQuote, ...rest];
  };

  const handlePinPress = (quoteId) => {
    // If we don’t allow multiple pins, toggle the pin
    if (pinnedQuoteId === quoteId) {
      // unpin
      setPinnedQuoteId(null);
    } else {
      // pin
      setPinnedQuoteId(quoteId);
    }
  };

  const renderItem = ({ item }) => {
    const isPinned = item.id === pinnedQuoteId;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('QuoteDetailScreen', { quote: item })}
      >
        {/* Top row with pin icon and timestamp */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => handlePinPress(item.id)}>
            <Text style={[styles.pinIcon, isPinned && styles.pinIconActive]}>
              {isPinned ? '\u{1F4CC}' : '\u{1F4CC}'}
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
    backgroundColor: '#D6CCF2', // to match your background
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
  pinIcon: {
    fontSize: 20,
    color: '#6B6B6B',
  },
  pinIconActive: {
    color: '#7C57FE', // different color if pinned
  },
  timestamp: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  quoteText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginVertical: 10,
  },
  author: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
  },
});
