import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { FlatList, Text, TextInput } from 'react-native-gesture-handler';
import CreateGroup from '../components/CreateGroup';
import GroupCard from '../components/GroupCard';
import JoinGroup from '../components/JoinGroup';
import { globalStyles } from '../styles/global';
import { $api } from '../types/constants';

const HomeScreen = () => {
  const [query, setQuery] = useState('');

  const emptyGroupData = {
    count: 0,
    next: null,
    previous: null,
    results: []
  };

  const { data, isLoading, isError } = $api.useQuery(
    "get",
    "/api/v1/groups/",
  )

  const groupData = data ?? emptyGroupData;

  const filteredGroups = useMemo(() => {
    return groupData.results.filter(group =>
      group.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [groupData, query])

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noGroupsText}>
          Loading groups...
        </Text>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noGroupsText}>
          Error loading groups
        </Text>
      </View>
    )
  }

  return (
    <>
      <View style={[globalStyles.container, styles.mainContainer]}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#FFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="search friend groups"
            placeholderTextColor="#FFF"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.buttonContainer}>
          <JoinGroup />
          <CreateGroup />
        </View>
        {
          filteredGroups.length === 0 ?
            <View style={styles.emptyContainer}>
              <Text style={styles.noGroupsText}>
                no groups to show
              </Text>
            </View> :
            <FlatList
              data={filteredGroups}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <GroupCard group={item} />}
              contentContainerStyle={styles.listContainer} // ensures even spacing
              keyboardShouldPersistTaps="handled" // allows smooth scrolling
              showsVerticalScrollIndicator={false} // this hides the scrollbar for cleaner UI
            />
        }

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 35,
    paddingVertical: 25,
  },
  container: {
    flex: 1, // allows the component to expand
  },
  input: {
    flex: 1,
    color: '#FFF', // White text color
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Work Sans'
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, // i added extra padding so the last item in the list is fully visible
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: -19,
  },
  searchContainer: {
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
  noGroupsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5F4078',
    marginBottom: 150,
    fontFamily: 'Work Sans'
  },
});

export default HomeScreen;

