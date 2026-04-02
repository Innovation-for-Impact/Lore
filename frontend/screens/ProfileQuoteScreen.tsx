import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RenderQuote } from '../components/ViewQuotes';
import { ProfileNavigation } from '../navigation/Navigators';
import { $api, infiniteQueryParams } from '../types/constants';
import { RootNavigation } from '../navigation/RootNavigator';

const ProfileQuoteScreen = () => {
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation<RootNavigation>();
  const navigation = useNavigation<ProfileNavigation>();

  const { data: quotes, hasNextPage: quoteNextPage, isFetching: quoteFetching, fetchNextPage: fetchNextQuotePage } = $api.useInfiniteQuery(
    "get",
    "/api/v1/quotes/",
    {},
    infiniteQueryParams
  )

  useEffect(() => {
    if (quoteNextPage && !quoteFetching) {
      fetchNextQuotePage();
    }
  }, [quoteNextPage, quoteFetching])

  const quotesList = quotes?.pages.flatMap(page => page.results) || [];
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={navigation.goBack}
        >
          <Ionicons name="arrow-back" size={35} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>my quotes</Text>
      </View>
      {
        quotesList.length === 0 ? (
          <Text>no quotes</Text>
        ) :
          <FlatList
            data={quotesList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RenderQuote item={item} onGoBack={() => rootNavigation.navigate('Profile', {
              screen: 'ProfileQuoteScreen',
            })} />}
            contentContainerStyle={
              {
                paddingBottom: insets.bottom + 100,
                alignItems: 'center',
              }
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
      }
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5B1E3',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between'
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  }
});

export default ProfileQuoteScreen;
