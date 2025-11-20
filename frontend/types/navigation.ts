import { NavigationProp } from "@react-navigation/native";
import { Quote } from "../components/ViewQuotes";

export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
  RegistrationScreen: undefined;
  CreateAccountScreen: undefined;
  CreateAccountEmailScreen: undefined;
  CreateAccountGroupScreen: undefined;
  CreateAccountProfileScreen: undefined;
  CreateAccountWelcomeScreen: undefined;
  WelcomeBack: undefined;
  CreateAccountNameScreen: undefined;
  ForgotPasswordScreen: undefined;

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

