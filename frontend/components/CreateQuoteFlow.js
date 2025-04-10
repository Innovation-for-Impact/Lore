import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Adjust these if needed
const MAX_QUOTE_LENGTH = 100;
const MAX_CONTEXT_LENGTH = 150;

const CreateQuoteFlow = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState('quote'); 
  const [quoteText, setQuoteText] = useState('');
  const [contextText, setContextText] = useState('');

  // Step 1: Quote
  const handleQuoteContinue = () => {
    if (!quoteText.trim()) return;
    setStep('context');
  };

  // Step 2: Context
  const handleContextContinue = () => {
    if (!contextText.trim()) return;
    finishAndNavigate();
  };

  const handleSkipContext = () => {
    // Skip the optional context
    setContextText('');
    finishAndNavigate();
  };

  // Final step: Immediately navigate to the quotes screen
  // so it shows "quote created" popup over the quotes background.
  const finishAndNavigate = () => {
    // (Optional) Save quoteText & contextText to your backend/Redux here

    // Force the user to the view quotes tab AND show the "quote created" modal
    navigation.navigate('CommunityStack', {
      screen: 'QuoteBoardScreen',
      params: {
        activeTab: 'viewQuotes',
        showCreatedModal: true,
      },
    });

    // Reset local state
    setQuoteText('');
    setContextText('');
    setStep('quote');
  };

  return (
    <View style={styles.container}>
      {/* STEP 1: QUOTE */}
      {step === 'quote' && (
        <View style={styles.stepContainer}>
          <View style={styles.whiteBox}>
            <TouchableOpacity
              style={styles.boxBackButton}
              onPress={() => {
                // Optional: goBack() or do nothing
              }}
            >
              <Text style={styles.boxBackArrow}>{'\u276E'}</Text>
            </TouchableOpacity>

            <TextInput
              style={[
                styles.textInput,
                { textAlign: quoteText.trim().length === 0 ? 'center' : 'left' },
              ]}
              placeholder="type quote"
              placeholderTextColor="#999"
              value={quoteText}
              onChangeText={setQuoteText}
              multiline
              maxLength={MAX_QUOTE_LENGTH}
            />
          </View>

          <Text style={styles.counter}>
            {MAX_QUOTE_LENGTH - quoteText.length} characters remaining
          </Text>

          <TouchableOpacity
            style={[styles.button, !quoteText.trim() && styles.disabledButton]}
            onPress={handleQuoteContinue}
            disabled={!quoteText.trim()}
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 2: CONTEXT */}
      {step === 'context' && (
        <View style={styles.stepContainer}>
          <View style={styles.whiteBox}>
            <TouchableOpacity
              style={styles.boxBackButton}
              onPress={() => setStep('quote')}
            >
              <Text style={styles.boxBackArrow}>{'\u276E'}</Text>
            </TouchableOpacity>

            <TextInput
              style={[
                styles.textInput,
                { textAlign: contextText.trim().length === 0 ? 'center' : 'left' },
              ]}
              placeholder="type context (optional)"
              placeholderTextColor="#999"
              value={contextText}
              onChangeText={setContextText}
              multiline
              maxLength={MAX_CONTEXT_LENGTH}
            />
          </View>

          <Text style={styles.counter}>
            {MAX_CONTEXT_LENGTH - contextText.length} characters remaining
          </Text>

          <TouchableOpacity
            style={[styles.button, !contextText.trim() && styles.disabledButton]}
            onPress={handleContextContinue}
            disabled={!contextText.trim()}
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={handleSkipContext}
          >
            <Text style={styles.btnText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CreateQuoteFlow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6CCF2',
    padding: 20,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  whiteBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minHeight: 160,
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  boxBackButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  boxBackArrow: {
    fontSize: 24,
    color: '#4A4A4A',
  },
  textInput: {
    marginTop: 40,
    fontSize: 16,
    color: '#333333',
    textAlignVertical: 'top',
    flex: 1,
  },
  counter: {
    textAlign: 'right',
    marginBottom: 10,
    fontSize: 14,
    color: '#6B6B6B',
  },
  button: {
    backgroundColor: '#7C57FE',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  btnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});
