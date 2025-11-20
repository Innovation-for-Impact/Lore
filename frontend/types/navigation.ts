import { NavigationProp } from "@react-navigation/native";
import { SetStateAction } from "react";
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
  CreateAccountWelcomeScreen: { setUser: React.Dispatch<SetStateAction<boolean>> };
  WelcomeBack: { setUser: React.Dispatch<SetStateAction<boolean>> };
  CreateAccountNameScreen: undefined;
  ForgotPasswordScreen: undefined;

  HomeScreen: undefined;
  GroupInfoScreen: { group: Group };

  CommunityScreen: undefined;
  QuoteBoardScreen: undefined;
  MemoryBoardScreen: undefined;
  AchievementBoardScreen: undefined;

  QuoteScreen: {
    activeTab?: 'viewQuotes' | 'otherTab';
    showCreatedModal?: boolean;
    quote?: {
      text?: string;
      author?: string;
      timestamp?: string;
    }
  };

  QuoteDetailScreen: {
     quote: Quote; 
  };
};

export type Navigation = NavigationProp<RootStackParamList>;

