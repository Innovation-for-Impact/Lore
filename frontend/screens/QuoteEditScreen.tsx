import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { globalStyles } from '../styles/global';
import { Navigation, RootStackParamList } from '../types/navigation';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const QuoteDetailScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<RouteProp<RootStackParamList, "QuoteScreen">>();

  // The 'quote' object was passed in from ViewQuotes:
  // e.g. navigation.navigate('QuoteDetailScreen', { quote: item });
  const { quote } = route.params || {};
  // Fallback if quote is missing
  const [quoteText, setQuoteText] = useState(quote?.text || '');
  const [author, setAuthor] = useState(quote?.author || '');
  const [context, setContext] = useState(''); // If you want to handle context locally

  // States to control edit mode
  const [editedText, setEditedText] = useState(quoteText);

  const handleBack = () => {
    navigation.goBack();
  };

  // Save updated text
  const handleSave = () => {
    // In a real app, you'd make an API call here:
    // await updateQuoteOnServer(quote.id, editedText);
    setQuoteText(editedText); // update local quote state
    Alert.alert('Success', 'Quote updated!');
  };

  // Placeholder for delete logic
  const handleDelete = () => {
    Alert.alert(
      'Delete Quote',
      'Are you sure you want to delete this quote?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, you'd remove the quote from your server or store

            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={styles.content}>
        {/* QUOTE DISPLAY / EDIT */}
        <View style={styles.quoteCard}>
            <View style={styles.header}>
              <TouchableOpacity
                  onPress={handleBack}
                  style={styles.backButton}
              >
                  <Ionicons name="arrow-back" size={35} color="#44344D" />
              </TouchableOpacity>
              <Text style={styles.timestamp}>{quote?.timestamp || '1 hour ago'}</Text>
            </View>
            <TextInput
              style={styles.quoteText}
              value={editedText}
              onChangeText={setEditedText}
              // multiline
              returnKeyType="default"
            />
            <Text style={styles.author}>{author}</Text>
          </View>

        {/* AUTHOR / CONTEXT (Optional) */}
        <View style={styles.infoSection}>
          <Text style={styles.label}>author: {author}</Text>
          <Text style={styles.label}>creation date: march 20th, 2025</Text>
          <Text style={styles.label}>context (optional):</Text>
          <TextInput
            style={styles.contextInput}
            placeholder="enter context"
            value={context}
            onChangeText={setContext}
          />
        </View>

        {/* BUTTONS: show Edit & Delete */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleSave}>
            <Text style={styles.buttonText}>save edits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>delete quote</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default QuoteDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 230,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 16,
    width: screenWidth * 0.85,
    minHeight: screenHeight * 0.20,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  timestamp: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'right',
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
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 16,
    width: screenWidth * 0.85,
    minHeight: screenHeight * 0.20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontFamily: 'Work Sans'
  },
  contextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginTop: 6,
    fontFamily: 'Work Sans'
  },
  buttonContainer: {
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#5F4078',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 10,
    width: screenWidth * 0.85,
  },
  deleteButton: {
    backgroundColor: '#9680B6',
    borderRadius: 8,
    paddingVertical: 14,
    width: screenWidth * 0.85,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Work Sans'
  },
});
