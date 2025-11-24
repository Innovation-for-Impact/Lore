import { Feather, Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { LoadingModal } from '../components/LoadingModal';
import { SuccessModal } from '../components/SuccessModal';
import { globalStyles } from '../styles/global';
import { $api } from '../types/constants';
import { Navigation, RootStackParamList } from '../types/navigation';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const QuoteDetailScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<RouteProp<RootStackParamList, "QuoteDetailScreen">>();
  const queryClient = useQueryClient();
  const [successModal, setSuccessModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { quote } = route.params;
  const [quoteText, setQuoteText] = useState(quote.text);
  // const [context, setContext] = useState('');

  const { mutateAsync: saveQuote, isPending: loadingSave } = $api.useMutation(
    "patch",
    "/api/v1/quotes/{id}/",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: $api.queryOptions("get", "/api/v1/quotes/").queryKey });
        setSuccessModal(true);
      },
      onError: () => {
        // TODO
      }
    }
  );

  const {mutateAsync: deleteQuote, isPending: loadingDelete } = $api.useMutation(
    "delete",
    "/api/v1/groups/{loregroup_pk}/quotes/{id}/",
    {
      onSuccess: () => {
        navigation.goBack();
        queryClient.invalidateQueries({ queryKey: $api.queryOptions("get", "/api/v1/quotes/").queryKey });
      },
      onError: () => {
        // TODO
      }
    }

  )

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    await saveQuote({
      params: {
        path: {
          id: quote.id.toString()
        }
      },
      body: {
        text: quoteText
      }
    })
  };

  // Placeholder for delete logic
  const handleDelete = async () => {
    await deleteQuote({
      params: {
        path: {
          id: quote.id.toString(),
          loregroup_pk: quote.group.toString()
        }
      }
    })

  };

  return (
    <>
      <LoadingModal visible={loadingSave} title='saving quote...' />
      <SuccessModal title='quote updated' visible={successModal} setVisible={setSuccessModal} buttonText={"go back"} callback={() => navigation.goBack()}/>
      <LoadingModal visible={loadingDelete} title='deleting quote...' />
      <ConfirmationModal title='delete quote?' visible={confirmDelete} setVisible={setConfirmDelete} left='cancel' right='delete' callback={handleDelete}/>
      <View style={[globalStyles.container, styles.container]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={35} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.quoteCard}>
            <View style={styles.header}>
              <Text style={styles.timestamp}>{new Date(quote.created).toLocaleString()}</Text>
              <Feather name="edit-2" size={20} />
            </View>
            <TextInput
              style={styles.quoteText}
              value={quoteText}
              onChangeText={setQuoteText}
              multiline={true}
              returnKeyType="default"
            />
            <Text style={styles.author}>{quote.said_by_username}</Text>
          </View>

          {/* AUTHOR / CONTEXT (Optional) */}
          {/* <View style={styles.infoSection}> */}
          {/*   <Text style={styles.label}>author: {author}</Text> */}
          {/*   <Text style={styles.label}>creation date: {new Date(quote.created).toLocaleDateString()}</Text> */}
          {/*   <Text style={styles.label}>context (optional):</Text> */}
          {/*   <TextInput */}
          {/*     style={styles.contextInput} */}
          {/*     placeholder="enter context" */}
          {/*     value={context} */}
          {/*     onChangeText={setContext} */}
          {/*   /> */}
          {/* </View> */}

          {/* BUTTONS: show Edit & Delete */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={handleSave}>
              <Text style={styles.buttonText}>save quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => setConfirmDelete(true)}>
              <Text style={styles.buttonText}>delete quote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
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
    justifyContent: 'space-between'
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
  // infoSection: {
  //   backgroundColor: '#FFFFFF',
  //   borderRadius: 12,
  //   padding: 15,
  //   marginHorizontal: 16,
  //   marginBottom: 16,
  //   width: screenWidth * 0.85,
  //   minHeight: screenHeight * 0.20,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   shadowOffset: { width: 0, height: 2 },
  //   elevation: 2,
  // },
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
