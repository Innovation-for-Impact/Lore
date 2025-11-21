import { NavigationProp } from "@react-navigation/native";
import { Quote } from "../components/ViewQuotes";
import { components } from './backend-schema';

type Group = components["schemas"]["Group"];

export type RootStackParamList = {
  LoginScreen: undefined;
  RegistrationScreen: undefined;
  CreateAccountScreen: undefined;
  CreateAccountEmailScreen: undefined;
  CreateAccountGroupScreen: undefined;
  CreateAccountProfileScreen: undefined;
  CreateAccountWelcomeScreen: undefined;
  WelcomeBack: undefined;
  CreateAccountNameScreen: undefined;
  ForgotPasswordScreen: undefined;

  HomeScreen: undefined;
  GroupInfoScreen: { group: Group };
  EditGroupScreen: { group: Group };

  CommunityScreen: undefined;
  QuoteBoardScreen: undefined;
  MemoryBoardScreen: undefined;
  AchievementBoardScreen: undefined;

  QuoteScreen: undefined;

  // QuoteScreen: {
  //   activeTab?: 'viewQuotes' | 'otherTab';
  //   showCreatedModal?: boolean;
  //   quote?: {
  //     text?: string;
  //     author?: string;
  //     timestamp?: string;
  //   }
  // };

  QuoteDetailScreen: {
     quote: Quote; 
  };
};

export type Navigation = NavigationProp<RootStackParamList>;

