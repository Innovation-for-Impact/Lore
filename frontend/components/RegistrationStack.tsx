import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/RegistrationScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import CreateAccountEmailScreen from '../screens/CreateAccountEmailScreen';
import CreateAccountProfileScreen from '../screens/CreateAccountProfileScreen';
import CreateAccountGroupScreen from '../screens/CreateAccountGroupScreen';
import CreateAccountWelcomeScreen from '../screens/CreateAccountWelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import WelcomeBackScreen from '../screens/WelcomeBackScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateAchievementScreen from '../screens/AcheivementScreens/CreateAchievementScreen';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../context/UserContext';

const Stack = createStackNavigator<RootStackParamList>();

function RegistrationStack() {
  const {setUser} = useUser();

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
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen 
        name="CreateAccountEmailScreen"
        component={CreateAccountEmailScreen} 
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
      <Stack.Screen name="CreateAccountWelcomeScreen" component={CreateAccountWelcomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="WelcomeBack" options={{ headerShown: false }} component={WelcomeBackScreen}/>
      <Stack.Screen
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default RegistrationStack;

