import { NavigationProp } from "@react-navigation/native";

export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
  RegistrationScreen: undefined;
  CreateAccountScreen: undefined;
  CreateAccountEmailScreen: undefined;
  CreateAccountGroupScreen: undefined;
  CreateAccountProfileScreen: undefined;
  CreateAccountWelcomeScreen: undefined;
  CreateAccountNameScreen: undefined;
  WelcomeBack: undefined;
  ForgotPasswordScreen: undefined;
  QuoteScreen: {
    activeTab?: 'viewQuotes' | 'otherTab';
    showCreatedModal?: boolean;
    quote?: {
      text?: string;
      author?: string;
      timestamp?: string;
    }
  };
};

export type Navigation = NavigationProp<RootStackParamList>;

