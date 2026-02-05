import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SuccessModal } from './SuccessModal';
import { ScrollView } from 'react-native-gesture-handler';
import { $api } from '../types/constants';
import { LoadingModal } from './LoadingModal';
import { useGroups } from '../utils/GroupUtils';
import { components } from '../types/backend-schema';
import { useUser } from '../context/UserContext';
import { FailureModal } from './FailureModal';

type Group = components["schemas"]["Group"];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const MAX_QUOTE_LENGTH = 100;
export const MAX_CONTEXT_LENGTH = 200;

enum Step {
  quote = "quote",
  context = "context",
  group = "group",
}

const CreateQuote = () => {
  const { user } = useUser();
  const [step, setStep] = useState<Step>(Step.quote);
  const [quoteText, setQuoteText] = useState('');
  const [contextText, setContextText] = useState('');

  const [quoteBoxHeight, setQuoteBoxHeight] = useState<number | null>(null);
  const [isMultiline, setIsMultiline] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [sucessModal, setSuccessModal] = useState(false);
  const [failureModal, setFailureModal] = useState(false);

  const { groups } = useGroups();

  // Step 1: Quote
  const handleQuoteContinue = () => {
    if (!quoteText.trim()) return;
    setStep(Step.context);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsDropdownOpen(false);
  };

  const { mutateAsync: createQuote, isPending: loadingCreate } = $api.useMutation(
    "post",
    "/api/v1/groups/{loregroup_pk}/quotes/",
    {
      onSuccess: () => {
        setSuccessModal(true);
        // Reset local state
        setQuoteText('');
        setContextText('');
        setStep(Step.quote);
      },
      onError: () => {
        setFailureModal(true);
        // console.log(JSON.stringify(error))
      }
    }
  )

  // Final step: Immediately navigate to the quotes screen
  // so it shows "quote created" popup over the quotes background.
  const finishAndNavigate = async () => {
    // Force the user to the view quotes tab AND show the "quote created" modal

    await createQuote({
      body: {
        text: quoteText,
        said_by: user!.id,
        pinned: false,
        group: selectedGroup!.id,
        context: contextText
      },
      params: {
        path: {
          loregroup_pk: String(selectedGroup!.id)
        }
      }
    })


  };

  return (
    <>
      <FailureModal title={"quote creation failed"} visible={failureModal} tryAgainCallback={finishAndNavigate} cancelCallback={() => setFailureModal(false)} />
      <LoadingModal title={'creating quote...'} visible={loadingCreate} />
      <SuccessModal title={"quote creatad"} visible={sucessModal} setVisible={setSuccessModal} buttonText='close' />
      <View style={styles.container}>
        {/* STEP 1: QUOTE */}

        {step === Step.quote ?
          <View style={styles.stepContainer}>
            <View style={styles.whiteBox}>
              <View style={styles.quote}>
                <Text style={[styles.quotationMarkLeft, isMultiline && { alignSelf: 'flex-start' }]}>&ldquo;</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { textAlign: quoteText.trim().length === 0 ? 'center' : 'left' },
                  ]}
                  onContentSizeChange={(e) => {
                    const height = e.nativeEvent.contentSize.height;
                    if (quoteBoxHeight === null) {
                      setQuoteBoxHeight(height);
                      return;
                    }
                    setIsMultiline(height > quoteBoxHeight + 2);
                  }}
                  placeholder="type quote"
                  placeholderTextColor="BFBFBF"
                  value={quoteText}
                  onChangeText={setQuoteText}
                  multiline={true}
                  maxLength={MAX_QUOTE_LENGTH}
                />
                <Text style={[styles.quotationMarkRight, isMultiline && { alignSelf: 'flex-end' }]}>&rdquo;</Text>
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

          : null
        }

        {step === Step.context ?
          <View style={styles.stepContainer}>
            <View style={styles.whiteBox}>
              <TouchableOpacity
                onPress={() => setStep(Step.quote)}
              >
                <Ionicons name="arrow-back" size={30} color="#44344D" />
              </TouchableOpacity>

              <TextInput
                style={[
                  styles.contextTextInput,
                  { textAlign: contextText.trim().length === 0 ? 'center' : 'left' },
                ]}
                placeholder="type context (optional)"
                placeholderTextColor="#BFBFBF"
                value={contextText}
                onChangeText={setContextText}
                multiline={true}
                maxLength={MAX_CONTEXT_LENGTH}
              />

              <Text style={styles.counter}>
                {MAX_CONTEXT_LENGTH - contextText.length} characters remaining
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, !contextText.trim() && styles.disabledButton]}
              onPress={() => setStep(Step.group)}
              disabled={!contextText.trim()}
            >
              <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => setStep(Step.group)}
            >
              <Text style={styles.btnText}>Skip</Text>
            </TouchableOpacity>
          </View> : null
        }

        {
          step === Step.group ?
            <View style={styles.container}>
              <View style={styles.stepContainer}>
                <View style={styles.whiteBox}>
                  <TouchableOpacity
                    onPress={() => setStep(Step.context)}
                  >
                    <Ionicons name="arrow-back" size={30} color="#44344D" />
                  </TouchableOpacity>
                  <Text style={styles.label}>select a group</Text>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Text style={[styles.dropdownText, !selectedGroup && styles.placeholderText]}>
                      {selectedGroup?.name || 'choose group'}
                    </Text>
                    <Ionicons
                      name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                      size={24}
                      color="#44344D"
                    />
                  </TouchableOpacity>

                  {isDropdownOpen && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.scrollView} nestedScrollEnabled>
                        {groups.map((group) => (
                          <TouchableOpacity
                            key={group.id}
                            style={[
                              styles.dropdownItem,
                              selectedGroup === group && styles.selectedItem
                            ]}
                            onPress={() => handleSelectGroup(group)}
                          >
                            <Text style={[
                              styles.dropdownItemText,
                              selectedGroup === group && styles.selectedItemText
                            ]}>
                              {group.name}
                            </Text>
                            {selectedGroup === group && (
                              <Ionicons name="checkmark" size={20} color="#5F4078" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.button, !selectedGroup && styles.disabledButton]}
                  onPress={finishAndNavigate}
                  disabled={!selectedGroup}
                >
                  <Text style={styles.btnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
            : null
        }
      </View>
    </>
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
  contextTextInput: {
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Work Sans'
  },

  label: {
    fontSize: 18,
    color: '#44344D',
    fontFamily: 'Work Sans',
    marginBottom: 15,
    textAlign: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 18,
    color: '#44344D',
    fontFamily: 'Work Sans',
  },
  placeholderText: {
    color: '#BFBFBF',
  },
  dropdownList: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedItem: {
    backgroundColor: '#F5F0F8',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#44344D',
    fontFamily: 'Work Sans',
  },
  selectedItemText: {
    color: '#5F4078',
    fontWeight: '500',
  },
});
