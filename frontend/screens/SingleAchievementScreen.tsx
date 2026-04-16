import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useTheme, useRoute } from '@react-navigation/native';
import React, { ReactEventHandler, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
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
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../context/UserContext';
import { ProfileNavigation } from '../navigation/Navigators';
import { $api, infiniteQueryParams } from '../types/constants';
import { ProfileStackParamList } from '../navigation/NavigationParams';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { AchievementCardProps, BadgeAssets } from './MyAchievementsScreen';


type Props = {
    route : RouteProp<ProfileStackParamList, 'SingleAchievementScreen'>;
}

const deleteAchievement = () => {

  const { data, isLoading, error } = $api.useQuery("get", "/api/v1/achievements/");

  if (!data || error) {
    console.log("NO DATA IS PRESENT, ERROR", error);
  }

  


};


export function SingleAchievementScreen({ route } : Props) {

    const insets = useSafeAreaInsets();
    const navigation = useNavigation<ProfileNavigation>();
    const { user } = useUser();

    const [modalVisible, setModalVisible] = useState(false);

    const { id } = route.params;

    const { data, error, isLoading } = $api.useQuery("get", "/api/v1/achievements/");

    if (error) {
        throw new Error(`Unable to retrieve achievement based on id: ${error}`);
    }

    const achievement = data ? data["results"].find((a: any) => a.id === id) : null;

    const queryClient = useQueryClient();

    const { mutateAsync: deleteAchievement, isPending: isDeleting } = $api.useMutation(
      "delete",
      "/api/v1/achievements/{id}/",
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: $api.queryOptions("get", "/api/v1/achievements/").queryKey });
          navigation.goBack();
        },
        onError: (e: any) => {
          Alert.alert("Unable to delete achievement", String(e));
        }
      }
    );

    const handleDelete = () => {
      if (!achievement) return;
      setModalVisible(true);

    };


    if (!achievement) {
        console.log("Unable to process achievement");
    }



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
                <TouchableOpacity onPress={() => navigation.navigate("MyAchievementsScreen")}>
                <Ionicons name="arrow-back" size={35} color={'white'}/>
                </TouchableOpacity>
            </View>

            <View style={{
                flex : 1, 
                flexDirection : "column"
            }}>

                {achievement ? (
                    <AchievementCard style={styles.magnifiedAchievementCard} achievementName={achievement.title} difficulty={achievement.difficulty} description={achievement.description}/>
                ) : (
                    <Text style={styles.smallerContent}>
                        something went wrong, please try again.
                    </Text>
                )}


                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={!achievement || isDeleting}>
                    <Text style={styles.deleteButtonText}>
                      delete created badge
                    </Text>
                </TouchableOpacity>


                {modalVisible && (
                  <Modal
                    visible={true}
                    transparent={true}
                    animationType="fade"
                  >
                    <View style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      
                      <View style={{
                        width: "85%",
                        backgroundColor: "white",
                        padding: 20,
                        borderRadius: 12
                      }}>

                        <Text style={[styles.deleteButtonText, { marginBottom: 20, color : "#5F4078" }]}>
                          are you sure you want to delete this badge from the group?
                        </Text>

                        <Text style={[styles.deleteButtonText, { color : "#5F4078" }]}>
                          this will also delete the existing member group's achievements with “{achievement?.title}” badge.
                        </Text>

                        <View style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          marginTop: 20
                        }}>
                          
                          <TouchableOpacity style={styles.yesButton} onPress={async () => {
                            await deleteAchievement({
                              params: { path: { id: String(achievement?.id) } }
                            });
                          }}>
                            {isDeleting ? (
                              <ActivityIndicator size="small" color="#44344D" />
                            ) : (
                              <Text style={{
                                fontWeight: "500",
                                fontFamily: "Work Sans",
                                fontSize: 14,
                                color: "#44344D"
                              }}>
                                yes
                              </Text>
                            )}
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.noButton} onPress={() => setModalVisible(false)}>
                            <Text style={{
                              fontWeight: "500",
                              fontFamily: "Work Sans",
                              fontSize: 14,
                              color: "white"
                            }}>
                              no, go back
                            </Text>
                          </TouchableOpacity>

                        </View>

                      </View>
                    </View>
                  </Modal>

                )}

                

                


            </View>

        </ScrollView>
    );

}






function AchievementCard({ style, achievementName, description, difficulty, onPress } : AchievementCardProps) {

    return (
      <>

      <TouchableOpacity onPress={onPress}>
        <View style={style}>
              {/* Badge image placeholder */}

            <View style={{
              flexDirection : 'row',
              height : 200, 
              width : 280, 
            }}>

              <Image source={BadgeAssets[difficulty]["INACTIVE"]} style={{
                width : "30%", 
                height : 90,
                justifyContent : 'flex-start', 
                marginRight : 10, 
                marginTop : 50
              }}/>

              {/* Descriptive content */}
              <View style={{
                  flexDirection : 'column',
                  marginTop : 50, 
                  width : '90%', 
                  
              }}>
                <Text ellipsizeMode={"tail"} style={[styles.info, { flexShrink : 1, marginBottom : 10 }]} numberOfLines={1}>
                    {achievementName}
                </Text>

                <Text style={[styles.smallerContent, { marginBottom : 10 }]}>
                  description: {description}
                </Text>

                <Text ellipsizeMode={"tail"} style={[styles.smallerContent, { flexShrink : 1, marginBottom : 10 }]} numberOfLines={1}>
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
  magnifiedAchievementCard : {
    width : 353,
    height : 230,
    backgroundColor : 'white',
    // top : 255, 
    // left : 14, 
    borderRadius : 11,
    paddingTop : 11, 
    paddingRight : 12, 
    paddingBottom : 16, 
    paddingLeft : 11, 
    marginTop : 20, 
    alignContent : 'center', 
  },

  deleteModal : {
    width : 328, 
    height : 244, 
    borderRadius : 8, 
    padding : 16,
    backgroundColor : 'white',
    alignSelf : "center" 

  }, 

  yesButton : {
    height : 44, 
    width : 60,
    borderRadius : 12, 
    backgroundColor : '#F7EEFF', 
    justifyContent : 'center',
    alignItems : 'center', 
    marginRight : 15,
  },

  noButton : {
    height : 44, 
    width : 100,
    borderRadius : 12, 
    backgroundColor : '#44344D', 
    justifyContent : 'center',
    alignItems : 'center'
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
    fontSize: 22,
    fontFamily: 'Work Sans',
    fontWeight : "600",
    lineHeight : 25,
  },

  smallerContent : {
    fontSize : 14, 
    lineHeight : 20, 
    fontWeight : '400',
    fontFamily : 'Work Sans'
  },

  deleteText : {
    fontSize : 16, 
    lineHeight : 24, 
    fontFamily : 'Work Sans', 
    fontWeight : "400"
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
  deleteButton : {
    backgroundColor : "#5F4078",
    width : 353, 
    height : 55, 
    borderRadius : 11, 
    marginTop : 200, 
    justifyContent : 'center', 
    alignItems : "center"
  },

  deleteButtonText : {
    fontFamily : "Work Sans",
    fontSize : 22, 
    color : 'white', 
    fontWeight : "400", 
  }

});




