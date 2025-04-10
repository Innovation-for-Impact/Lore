import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const QuoteDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // The 'quote' object was passed in from ViewQuotes:
  // e.g. navigation.navigate('QuoteDetailScreen', { quote: item });
  const { quote } = route.params || {};
  // Fallback if quote is missing
  const [quoteText, setQuoteText] = useState(quote?.text || '');
  const [author, setAuthor] = useState(quote?.author || '');
  const [context, setContext] = useState(''); // If you want to handle context locally

  // States to control edit mode
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(quoteText);

  const handleBack = () => {
    navigation.goBack();
  };

  // Toggle into "edit mode"
  const handleEdit = () => {
    setEditedText(quoteText); // start with existing quote text
    setEditMode(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(false);
  };

  // Save updated text
  const handleSave = () => {
    // In a real app, you'd make an API call here:
    // await updateQuoteOnServer(quote.id, editedText);

    setQuoteText(editedText); // update local state
    setEditMode(false);
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backArrow}>{'\u276E'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quote Detail</Text>
      </View>

      <View style={styles.content}>
        {/* QUOTE DISPLAY / EDIT */}
        {editMode ? (
          // EDIT MODE
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editedText}
              onChangeText={setEditedText}
              multiline
            />
            <View style={styles.editButtons}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // READ MODE
          <View style={styles.quoteCard}>
            <Text style={styles.timestamp}>{quote?.timestamp || '1 hour ago'}</Text>
            <Text style={styles.quoteText}>{quoteText}</Text>
            <Text style={styles.author}>{author}</Text>
          </View>
        )}

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

        {/* BUTTONS: if not editing, show Edit & Delete */}
        {!editMode && (
          <>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.buttonText}>Edit Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete Quote</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default QuoteDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6CCF2', // Pastel lavender background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    paddingRight: 10,
  },
  backArrow: {
    fontSize: 24,
    color: '#4A4A4A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  },
  quoteText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginVertical: 10,
  },
  author: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  },
  contextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginTop: 6,
  },
  editButton: {
    backgroundColor: '#7C57FE',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#A66EFF',
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  // EDIT MODE STYLES
  editContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  editInput: {
    fontSize: 16,
    color: '#333333',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
