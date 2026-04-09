import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { ProfileNavigation } from '../navigation/Navigators';
import { $api, infiniteQueryParams } from '../types/constants';

const { width } = Dimensions.get('window');


function MyAchievementsScreen() {

    const navigation = useNavigation<ProfileNavigation>();
    
    return (
        <View style={styles.container}>
            {/* <View style={{
                flexDirection : 'row',
                justifyContent : 'space-between'
            }}/>
                <TouchableOpacity style={{
                    backgroundColor : "transparent"
                }}
                onPress={() => Alert.alert("Go back to profile screen!")}
                >
                    <Ionicons name="arrow-back" color={"white"} size={15}/>
                </TouchableOpacity>
            </View> */}
            <View style={{
              flexDirection : 'row',
              justifyContent : 'space-between'
            }}}>

            </View>
  
          </View>



       
    ); 

}


const styles = StyleSheet.create({
  contentWrapper: {
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#AFB0E4',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  avatar: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  placeholderAvatar: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#9680B6',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Work Sans',
    textAlign: 'center',
    color: '#44344D',
  },
  info: {
    fontSize: 16,
    fontFamily: 'Work Sans',
    marginBottom: 10,
  },
  leaveButton: {
    borderRadius: 10,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
    width: '100%',
  },
  copyButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});