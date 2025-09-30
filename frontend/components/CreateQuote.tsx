import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommunityStackParamList } from '../components/CommunityStack';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Adjust these if needed
const MAX_QUOTE_LENGTH = 100;
const MAX_CONTEXT_LENGTH = 200;

type CreateQuoteNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'QuoteBoardScreen'
>;

const CreateQuote = () => {
  const navigation = useNavigation<CreateQuoteNavigationProp>();
  const [step, setStep] = useState('quote'); 
  const [quoteText, setQuoteText] = useState('');
  const [contextText, setContextText] = useState('');

  // Step 1: Quote
  const handleQuoteContinue = () => {
    if (!quoteText.trim()) return;
    setStep('context');
  };

  // Final step: Immediately navigate to the quotes screen
  // so it shows "quote created" popup over the quotes background.
  const finishAndNavigate = () => {

    // Force the user to the view quotes tab AND show the "quote created" modal
    type RootStackParamList = {
      CommunityStack: {
        screen: keyof CommunityStackParamList;
        params?: {
          activeTab?: 'viewQuotes' | 'otherTab';
          showCreatedModal?: boolean;
        };
      };
    };

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
            <View style={styles.quote}>
              <Text style={styles.quotationMarkLeft}>"</Text>
              <TextInput
                style={[
                  styles.textInput,
                  { textAlign: quoteText.trim().length === 0 ? 'center' : 'left' },
                ]}
                placeholder="type quote"
                placeholderTextColor="BFBFBF"
                value={quoteText}
                onChangeText={setQuoteText}
                // multiline
                maxLength={MAX_QUOTE_LENGTH}
              />
              <Text style={styles.quotationMarkRight}>"</Text>
            </View>

            {/* quote length */}
            <Text style={styles.counter}>
              {MAX_QUOTE_LENGTH - quoteText.length} characters remaining
            </Text>
          </View>

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
                onPress={() => setStep('quote')}
            >
                <Ionicons name="arrow-back" size={30} color="#44344D" />
            </TouchableOpacity>

            <TextInput
              style={[
                styles.textInput,
                { textAlign: contextText.trim().length === 0 ? 'center' : 'left' },
              ]}
              placeholder="type context (optional)"
              placeholderTextColor="#BFBFBF"
              value={contextText}
              onChangeText={setContextText}
              // multiline
              maxLength={MAX_CONTEXT_LENGTH}
            />
            
            <Text style={styles.counter}>
              {MAX_CONTEXT_LENGTH - contextText.length} characters remaining
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, !contextText.trim() && styles.disabledButton]}
            // onPress={handleContextContinue}
            onPress={finishAndNavigate}
            disabled={!contextText.trim()}
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            // onPress={handleSkipContext}
            onPress={finishAndNavigate}
          >
            <Text style={styles.btnText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CreateQuote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  whiteBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
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
  textInput: {
    marginTop: 40,
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
    marginBottom: 30,
    fontFamily: 'Work Sans'
  },
  quotationMarkLeft: {
    fontSize: 24,
    paddingLeft: 20,
    fontFamily: 'Work Sans'
  },
  quotationMarkRight: {
    fontSize: 24,
    paddingRight: 20,
    fontFamily: 'Work Sans'
  },
  quote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 20,
  },
  counter: {
    textAlign: 'center',
    fontSize: 12,
    color: '#BFBFBF',
    fontFamily: 'Work Sans'
  },
  button: {
    backgroundColor: '#5F4078',
    width: screenWidth * 0.85,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Work Sans'
  },
  disabledButton: {
    backgroundColor: '#9680B6',
  },
});
