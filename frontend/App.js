import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './components/Navigation';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator(); 

export default function App() {
  const [fontsLoaded] = useFonts({
    'Work Sans': require('./assets/fonts/WorkSans-VariableFont_wght.ttf'),
  });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}