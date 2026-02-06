import { NavigatorScreenParams } from '@react-navigation/native';
import { Group, Quote } from '../types/constants';

export type RegistrationStackParamList = {
  RegistrationScreen: undefined;
  CreateAccountScreen: undefined;
  LoginScreen: undefined;
  CreateAccountEmailScreen: undefined;
  CreateAccountProfileScreen: undefined;
  CreateAccountGroupScreen: undefined;
  CreateAccountWelcomeScreen: undefined;
  WelcomeBack: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  GroupInfoScreen: { group: Group };
  GroupEditScreen: { group: Group };
  CommunityScreen: { group: Group };
  QuoteBoardScreen: { group: Group };
  MemoryBoardScreen: { group: Group };
  AchievementBoardScreen: { group: Group };
  QuoteDetailScreen: { group: Group, quote: Quote };
  ChallengeList: { group: Group };
  ChallengeDetail: { group: Group, id: string };
  ChallengeCreate: { group: Group };
  CreateAchievementScreen: { group: Group };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  ProfileEditScreen: undefined;
}

export type RootStackParamList = {
  Auth: NavigatorScreenParams<RegistrationStackParamList>;
  Navbar: undefined;
  Home: NavigatorScreenParams<HomeStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};
