import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommunityStackParamList, HomeStackParamList, ProfileStackParamList, RegistrationStackParamList } from './NavigationParams';
import CommunityScreen from '../screens/CommunityScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountEmailScreen from '../screens/CreateAccountEmailScreen';
import CreateAccountProfileScreen from '../screens/CreateAccountProfileScreen';
import CreateAccountGroupScreen from '../screens/CreateAccountGroupScreen';
import CreateAccountWelcomeScreen from '../screens/CreateAccountWelcomeScreen';
import WelcomeBackScreen from '../screens/WelcomeBackScreen';
import HomeScreen from '../screens/HomeScreen';
import GroupInfoScreen from '../screens/GroupInfoScreen';
import GroupEditScreen from '../screens/GroupEditScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import QuoteBoardScreen from '../screens/QuoteBoardScreen';
import MemoryBoardScreen from '../screens/MemoryBoardScreen';
import AchievementBoardScreen from '../screens/AchievementBoardScreen';
import QuoteDetailScreen from '../screens/QuoteEditScreen';
import ChallengeListScreen from '../screens/ChallengeScreens/ChallengeListScreen';
import CreateAchievementScreen from '../screens/AchievementScreens/CreateAchievementScreen';
import ChallengeDetailScreen from '../screens/ChallengeScreens/ChallengeDetailScreen';

const AuthStack = createNativeStackNavigator<RegistrationStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const CommunityStack = createNativeStackNavigator<CommunityStackParamList>();

export function RegistrationNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'default' }}>
      <AuthStack.Screen name="RegistrationScreen" component={RegistrationScreen} />
      <AuthStack.Screen name="CreateAccountScreen" component={CreateAccountScreen} />
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="CreateAccountEmailScreen" component={CreateAccountEmailScreen} />
      <AuthStack.Screen name="CreateAccountProfileScreen" component={CreateAccountProfileScreen} />
      <AuthStack.Screen name="CreateAccountGroupScreen" component={CreateAccountGroupScreen} />
      <AuthStack.Screen name="CreateAccountWelcomeScreen" component={CreateAccountWelcomeScreen} />
      <AuthStack.Screen name="WelcomeBack" component={WelcomeBackScreen} />
    </AuthStack.Navigator>
  );
}

export function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, animation: 'default' }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="GroupInfoScreen" component={GroupInfoScreen} />
      <HomeStack.Screen name="GroupEditScreen" component={GroupEditScreen} />
    </HomeStack.Navigator>
  );
}

export function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false, animation: 'default' }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="ProfileEditScreen" component={ProfileEditScreen} />
    </ProfileStack.Navigator>
  );
}

export function CommunityNavigator() {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false, animation: 'default' }}>
      <CommunityStack.Screen name="CommunityScreen" component={CommunityScreen} />
      <CommunityStack.Screen name="QuoteBoardScreen" component={QuoteBoardScreen} />
      <CommunityStack.Screen name="MemoryBoardScreen" component={MemoryBoardScreen} />
      <CommunityStack.Screen name="AchievementBoardScreen" component={AchievementBoardScreen} />
      <CommunityStack.Screen name="QuoteDetailScreen" component={QuoteDetailScreen} />
      <CommunityStack.Screen name="ChallengeList" component={ChallengeListScreen} />
      <CommunityStack.Screen name="ChallengeCreate" component={ChallengeCreateScreen} />
      <CommunityStack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
      <CommunityStack.Screen name="CreateAchievementScreen" component={CreateAchievementScreen} />
    </CommunityStack.Navigator>

  )
}

import { NavigationProp } from "@react-navigation/native";
import ChallengeCreateScreen from '../screens/ChallengeScreens/ChallengeCreateScreen';
export type HomeNavigation = NavigationProp<HomeStackParamList>
export type AuthNavigation = NavigationProp<RegistrationStackParamList>
export type CommunityNavigation = NavigationProp<CommunityStackParamList>
export type ProfileNavigation = NavigationProp<ProfileStackParamList>

