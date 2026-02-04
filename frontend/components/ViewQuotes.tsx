import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { components } from '../types/backend-schema';
import { $api, infiniteQueryParams } from '../types/constants';
import { useUser } from '../context/UserContext';
import { CommunityNavigation } from '../navigation/Navigators';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Quote = components["schemas"]["Quote"];

const ViewQuotes = () => {
  const navigation = useNavigation<CommunityNavigation>();
  const { user } = useUser();

  const { mutateAsync: patchQuote } = $api.useMutation(
    "patch",
    "/api/v1/groups/{loregroup_pk}/quotes/{id}/",
  )

  const { data: quotesData, isError, isLoading, hasNextPage, isFetching, fetchNextPage } = $api.useInfiniteQuery(
    "get",
    "/api/v1/quotes/",
    {},
    infiniteQueryParams,
  )

  useEffect(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const quotes = useMemo(
    () => quotesData?.pages.flatMap(page => page.results || page) || [],
    [quotesData]
  );

  const [pinnedQuotes, setPinnedQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    const serverPinned = quotes.filter(q => q.pinned);
    setPinnedQuotes(serverPinned);
  }, [quotes]);

  const handlePinPress = async (quote: Quote) => {
    const isPinned = pinnedQuotes.includes(quote);
    setPinnedQuotes(prev =>
      isPinned ? prev.filter(q => q.id !== quote.id) : [...prev, quote]
    );

    await patchQuote({
      params: {
        path: {
          id: quote.id.toString(),
          loregroup_pk: quote.group.toString()
        }
      },
      body: { pinned: !isPinned }
    });
  };

  const renderItem = ({ item }: { item: Quote }) => {
    const isPinned = pinnedQuotes.includes(item);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (item.said_by === user!.id) {
            navigation.navigate('QuoteDetailScreen', { quote: item })
          }
          else {
            Alert.alert(
              "Cannot Edit",
              "You can only edit quotes that you created.",
              [{ text: "OK" }]
            );
          }
        }}
      >
        {/* Top row with pin icon and timestamp */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => handlePinPress(item)}>
            <Text>
              {isPinned ?
                <MaterialCommunityIcons name="pin" size={32} color="#44344D" />
                :
                <MaterialCommunityIcons name="pin-outline" size={32} color="#44344D" />
              }
            </Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{new Date(item.created).toLocaleString()}</Text>
        </View>

        {/* Quote text in the middle */}
        <Text style={styles.quoteText}>{item.text}</Text>

        {
          item.context !== "" ?
            <Text style={styles.context}> context: {item.context} </Text> : null
        }

        {/* Author at the bottom center */}
        <Text style={styles.author}>{item.said_by_username}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C57FE" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noQuoteText}>an error occured</Text>
      </View >
    );
  }

  const orderedQuotes = [
    ...quotes.filter(q => pinnedQuotes.includes(q)),
    ...quotes.filter(q => !pinnedQuotes.includes(q))
  ];

  return (
    <>
      {orderedQuotes.length === 0 ?
        <View style={styles.emptyContainer}>
          <Text style={styles.noQuoteText}> no quotes to show. make some! </Text>
        </View > :
        <FlatList
          data={orderedQuotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      }
    </>
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
    marginBottom: 50,
    fontFamily: 'Work Sans'
  },
  author: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    fontFamily: 'Work Sans'
  },
  noQuoteText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5F4078',
    marginBottom: 150,
    fontFamily: 'Work Sans'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  context: {
    fontSize: 18,
    color: '#5F4078',
    textAlign: 'center',
    fontFamily: 'Work Sans',
  },
});
