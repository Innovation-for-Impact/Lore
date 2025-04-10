import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ViewQuotes from '../components/ViewQuotes';
import CreateQuoteFlow from '../components/CreateQuoteFlow';

const QuoteBoardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [activeTab, setActiveTab] = useState('viewQuotes');
  const [showCreatedModal, setShowCreatedModal] = useState(false);

  useEffect(() => {
    // If route.params?.activeTab is provided, set it
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
    // If route.params?.showCreatedModal is provided, show the popup
    if (route.params?.showCreatedModal) {
      // Force user onto "view quotes" tab
      setActiveTab('viewQuotes');
      setShowCreatedModal(true);
    }
  }, [route.params]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backArrow}>{'\u276E'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Quote Board</Text>
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
            showCreatedModal={showCreatedModal}
            onHideModal={() => setShowCreatedModal(false)}
          />
        ) : (
          <CreateQuoteFlow />
        )}
      </View>
    </View>
  );
};

export default QuoteBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6CCF2',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    paddingRight: 10,
  },
  backArrow: {
    fontSize: 24,
    color: '#4A4A4A',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E9E1FA',
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
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B6B6B',
    textTransform: 'capitalize',
  },
  activeTabText: {
    color: '#6B6B6B',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
});

