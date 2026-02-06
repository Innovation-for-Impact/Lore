import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AchievementBoardScreen from '../screens/AchievementBoardScreen';
import CreateAchievementScreen from '../screens/AchievementScreens/CreateAchievementScreen';
import ChallengeDetailScreen from '../screens/ChallengeScreens/ChallengeDetailScreen';
import ChallengeListScreen from '../screens/ChallengeScreens/ChallengeListScreen';
import CreateAccountEmailScreen from '../screens/CreateAccountEmailScreen';
import CreateAccountGroupScreen from '../screens/CreateAccountGroupScreen';
import CreateAccountProfileScreen from '../screens/CreateAccountProfileScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import CreateAccountWelcomeScreen from '../screens/CreateAccountWelcomeScreen';
import GroupEditScreen from '../screens/GroupEditScreen';
import GroupInfoScreen from '../screens/GroupInfoScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MemoryBoardScreen from '../screens/MemoryBoardScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuoteBoardScreen from '../screens/QuoteBoardScreen';
import QuoteDetailScreen from '../screens/QuoteEditScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import WelcomeBackScreen from '../screens/WelcomeBackScreen';
import { HomeStackParamList, ProfileStackParamList, RegistrationStackParamList } from './NavigationParams';

const AuthStack = createNativeStackNavigator<RegistrationStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

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
      <HomeStack.Screen name="QuoteBoardScreen" component={QuoteBoardScreen} />
      <HomeStack.Screen name="MemoryBoardScreen" component={MemoryBoardScreen} />
      <HomeStack.Screen name="AchievementBoardScreen" component={AchievementBoardScreen} />
      <HomeStack.Screen name="QuoteDetailScreen" component={QuoteDetailScreen} />
      <HomeStack.Screen name="ChallengeList" component={ChallengeListScreen} />
      <HomeStack.Screen name="ChallengeCreate" component={ChallengeCreateScreen} />
      <HomeStack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
      <HomeStack.Screen name="CreateAchievementScreen" component={CreateAchievementScreen} />
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

import { NavigationProp } from "@react-navigation/native";
import ChallengeCreateScreen from '../screens/ChallengeScreens/ChallengeCreateScreen';
export type HomeNavigation = NavigationProp<HomeStackParamList>
export type AuthNavigation = NavigationProp<RegistrationStackParamList>
export type ProfileNavigation = NavigationProp<ProfileStackParamList>

