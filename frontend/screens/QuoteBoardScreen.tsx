import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CreateQuote from '../components/CreateQuote';
import ViewQuotes from '../components/ViewQuotes';
import { globalStyles } from '../styles/global';
import { Navigation, RootStackParamList } from '../types/navigation';
// import { $api, BACKEND_URL } from '../types/constants';
// import { useUser } from '../context/UserContext';

const QuoteBoardScreen = () => {
  // const { user } = useUser();
  const navigation = useNavigation<Navigation>();
  // const { data: quotesData, isError, error } = $api.useQuery(
  //   "get",
  //   "/api/v1/groups/{loregroup_pk}/quotes/",
  //   {
  //     params: {
  //       path: {
  //         loregroup_pk: 23,
  //         id: 2
  //       }
  //     }
  //   },
  // );
  // useEffect(() => {
  //   // const init = async () => {
  //   //   const response = await fetch(`${BACKEND_URL}/api/v1/groups/?group_id=2&loregroup_pk=23`);
  //   //   const body = await response.json();
  //   //   console.log(body);
  //   // }
  //   // init();
  //   if (quotesData) {
  //     console.log(quotesData);
  //   }
  //   if (isError) {
  //     console.log(error);
  //   }
  // }, [quotesData, isError, error])
  // const route = useRoute<RouteProp<RootStackParamList, "QuoteScreen">>();

  const [activeTab, setActiveTab] = useState('viewQuotes');
  const [showCreatedModal, setShowCreatedModal] = useState(false);

  // useEffect(() => {
  //   // If route.params?.activeTab is provided, set it
  //   if (route.params?.activeTab) {
  //     setActiveTab(route.params.activeTab);
  //   }
  //   // If route.params?.showCreatedModal is provided, show the popup
  //   if (route.params?.showCreatedModal) {
  //     // Force user onto "view quotes" tab
  //     setActiveTab('viewQuotes');
  //     setShowCreatedModal(true);
  //   }
  // }, [route.params]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
            onPress={handleBack}
        >
            <Ionicons name="arrow-back" size={35} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'viewQuotes' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('viewQuotes')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'viewQuotes' && styles.activeTabText,
            ]}
          >
            view quotes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'createQuotes' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('createQuotes')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'createQuotes' && styles.activeTabText,
            ]}
          >
            create quotes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'viewQuotes' ? (
          <ViewQuotes
            // showCreatedModal={showCreatedModal}
            // onHideModal={() => setShowCreatedModal(false)}
          />
        ) : (
          <CreateQuote />
        )}
      </View>
    </View>
  );
};

export default QuoteBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#e6e7ff',
    borderRadius: 20,
    marginTop: 16,
    padding: 4,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  activeTabItem: {
    backgroundColor: '#44344D',
  },
  tabText: {
    fontSize: 14,
    color: '#44344D',
    fontFamily: 'Work Sans'
  },
  activeTabText: {
    color: '#ffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
});

