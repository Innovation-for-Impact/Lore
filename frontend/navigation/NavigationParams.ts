import { components } from '../types/backend-schema';

type Group = components["schemas"]["Group"];
type Quote = components["schemas"]["Quote"];

import { NavigatorScreenParams } from '@react-navigation/native';

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
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  ProfileEditScreen: undefined;
}

export type CommunityStackParamList = {
  CommunityScreen: undefined;
  QuoteBoardScreen: undefined;
  MemoryBoardScreen: undefined;
  AchievementBoardScreen: undefined;
  QuoteDetailScreen: { quote: Quote };
  ChallengeList: undefined;
  ChallengeDetail: { id: string };
  CreateAchievementScreen: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<RegistrationStackParamList>;
  Home: NavigatorScreenParams<HomeStackParamList>;
  Community: NavigatorScreenParams<CommunityStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};
