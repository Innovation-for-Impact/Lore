import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { ReactEventHandler, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { ProfileNavigation } from '../navigation/Navigators';
import { $api, infiniteQueryParams } from '../types/constants';
import { ProfileStackParamList } from '../navigation/NavigationParams';
import { useQuery } from '@tanstack/react-query';
import { AccessTokenRequest } from 'expo-auth-session';
import { LoadingModal } from '../components/LoadingModal';

const { width } = Dimensions.get('window');

type Props = {
  route: RouteProp<ProfileStackParamList, 'MyAchievementsScreen'>;
};



import easyBadge from '../assets/achievement-badges/Badge_01_activated.png';
import easyBadgeDeactive from '../assets/achievement-badges/Badge_01_deactivated.png';
import mediumBadge from '../assets/achievement-badges/Badge_02_activated.png';
import mediumBadgeDeactive from '../assets/achievement-badges/Badge_02_deactivated.png';



export const BadgeAssets = {
  1: {
    ACTIVE: easyBadge,
    INACTIVE: easyBadgeDeactive
  },
  2: {
    ACTIVE: mediumBadge,
    INACTIVE: mediumBadgeDeactive
  },
  3: {
    ACTIVE: mediumBadge,
    INACTIVE: mediumBadge, 
  }
};

export function MyAchievementsScreen({ route } : Props) {
    // const initialGroup = route.params.group;
    const navigation = useNavigation<ProfileNavigation>();

    const { user } = useUser();

    const insets = useSafeAreaInsets();


    const { data, isLoading, isError, error, isLoadingError } = $api.useQuery("get", "/api/v1/achievements/");

    console.log(data?.count);
    
    const myAchievements = data && data.results ? data.results.filter((achievement) => 
      // If user?.id is undefined, it searches for -1 instead
      achievement.achieved_by?.includes(user?.id ?? -1)
    )
  : [];
    


    isLoading ? console.log("Is loading...") : console.log("Done loading...");

    if (isError) {
      console.log(error);
      throw new Error("unable to access the achievements at the designated url!");
    }

    if (isLoadingError) {
      console.log("Error in loading request!");
    }

    myAchievements.length > 0 ? console.log("Achievements are loaded in.") : console.log("Achievements are not loaded in");
    
    
    return (
      
      <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, {
        paddingTop : insets.top,
        paddingBottom : insets.bottom + 150
      }]}
      showsVerticalScrollIndicator={true}>
        
        <View style={styles.header}>
          {/* Back arrow */}
          <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
            <Ionicons name="arrow-back" size={35} color={'white'}/>
          </TouchableOpacity>
        </View>

        <View style={{
          marginTop : -10, 
        }}>
          <Text style={styles.title}>
            my achievements
          </Text>


        </View>

        {!isLoading && (

          <View style={{
          flex : 1, 
          flexDirection : 'column'
          }}>
            {myAchievements.length > 0 ? myAchievements.map(({ id, title, difficulty, description }) => (
              <AchievementCard onPress={() => navigation.navigate("SingleAchievementScreen", { id })} key={id} achievementName={title} description={description} difficulty={difficulty} style={styles.achievementCard}/>
            )) : (
              <Text style={[styles.info, { color : "#5F4078", fontSize : 20, fontStyle : 'italic', marginTop : 50 }]}>
                no achievements yet, go out there and get to achieving!
              </Text>

            )}

            
          </View>

          
       
          

        )}

        {isLoading && ( 
          <ActivityIndicator style={{ marginTop : 50 }} color={"#5F4078"} size={"large"}/>
        )}

        
    



      </ScrollView>
       
    ); 

}


export type AchievementCardProps = {
  style : StyleProp<ViewStyle>,
  achievementName : string, 
  description : string,
  difficulty : 1 | 2 | 3, 
  onPress? : () => void
};

function AchievementCard({ style, achievementName, description, difficulty, onPress } : AchievementCardProps) {

    return (
      <>

      <TouchableOpacity onPress={onPress}>
        <View style={style}>
              {/* Badge image placeholder */}

            <View style={{
              flexDirection : 'row',
              height : 85, 
              width : 280
            }}>

              <Image source={BadgeAssets[difficulty]["INACTIVE"]} style={{
                width : 50, 
                height : 50,
                justifyContent : 'flex-start', 
                marginRight : 10, 
              }}/>

              {/* Descriptive content */}
              <View style={{
                  flexDirection : 'column',
                  marginTop : 5,
              }}>
                <Text ellipsizeMode={"tail"} style={[styles.info, { flexShrink : 1 }]} numberOfLines={1}>
                    {achievementName}
                </Text>

                <Text ellipsizeMode={"tail"} style={styles.smallerContent} numberOfLines={1}>
                  description: {description}
                </Text>

                <Text ellipsizeMode={"tail"} style={[styles.smallerContent, { flexShrink : 1 }]} numberOfLines={1}>
                  difficulty : {difficulty}
                </Text>


              </View>
          </View>




        </View>
      
      </TouchableOpacity>
      </>

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
  achievementCard : {
    width : 353,
    height : 80,
    backgroundColor : 'white',
    // top : 255, 
    // left : 14, 
    borderRadius : 11,
    paddingTop : 8, 
    paddingRight : 12, 
    paddingBottom : 8, 
    paddingLeft : 11, 
    marginTop : 20, 
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

  title : {
    fontSize : 32, 
    fontWeight : "500", 
    lineHeight : 40, 
    fontFamily : 'Work Sans'
  },


  info: {
    fontSize: 14,
    fontFamily: 'Work Sans',
    fontWeight : "600",
    lineHeight : 20,
  },

  smallerContent : {
    fontSize : 12, 
    lineHeight : 16, 
    fontWeight : '400',
    fontFamily : 'Work Sans'
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
