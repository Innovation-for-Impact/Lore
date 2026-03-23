import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CreateQuote from '../components/CreateQuote';
import ViewQuotes from '../components/ViewQuotes';
import { HomeNavigation } from '../navigation/Navigators';
import { HomeStackParamList } from '../navigation/NavigationParams';

enum Tabs {
  viewQuotes = "viewQuotes",
  createQuote = "createQuote"
};

interface Props {
  route: RouteProp<HomeStackParamList, 'QuoteBoardScreen'>;
}
const QuoteBoardScreen = ({ route }: Props) => {
  const { group } = route.params;
  const navigation = useNavigation<HomeNavigation>();

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.viewQuotes);

  const insets = useSafeAreaInsets();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
            activeTab === Tabs.viewQuotes && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab(Tabs.viewQuotes)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === Tabs.viewQuotes && styles.activeTabText,
            ]}
          >
            view quotes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === Tabs.createQuote && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab(Tabs.createQuote)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === Tabs.createQuote && styles.activeTabText,
            ]}
          >
            create quotes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === Tabs.viewQuotes && (
          <>
            <Text style={styles.headerText}>
              quotes
            </Text>
            <Text style={styles.descriptionText}>
              {"check out your group quotes and pin your favorites, or create a revolutionary quote yourself!"}
            </Text>
            <ViewQuotes group={group} />
          </>
        )}

        {activeTab === Tabs.createQuote && (
          <CreateQuote group={group} />
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
  headerText: {
    fontFamily: 'Work Sans',
    fontSize: 32,
    marginLeft: 18,
    fontWeight: '400',
    color: '#000000ff',
  },
  descriptionText: {
    marginTop: 8,
    marginBottom: 18,
    marginLeft: 18,
    fontFamily: 'Work Sans',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000ff',
  }
});

