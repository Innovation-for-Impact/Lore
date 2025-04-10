import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/RegistrationScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import CreateAccountEmailScreen from '../screens/CreateAccountEmailScreen';
import CreateAccountNameScreen from '../screens/CreateAccountNameScreen';
import CreateAccountProfileScreen from '../screens/CreateAccountProfileScreen';
import CreateAccountGroupScreen from '../screens/CreateAccountGroupScreen';
import CreateAccountWelcomeScreen from '../screens/Welcome';
import LoginScreen from '../screens/LoginScreen';
import WelcomeBackScreen from '../screens/WelcomeBackScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

function RegistrationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="RegistrationScreen"
        component={RegistrationScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateAccountScreen" 
        component={CreateAccountScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateAccountEmailScreen"
        component={CreateAccountEmailScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateAccountNameScreen"
        component={CreateAccountNameScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateAccountProfileScreen"
        component={CreateAccountProfileScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateAccountGroupScreen"
        component={CreateAccountGroupScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateAccountWelcomeScreen" 
        component={CreateAccountWelcomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="WelcomeBack" 
        component={WelcomeBackScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default RegistrationStack;