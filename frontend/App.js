import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import Navigation from './components/navigation';

const Stack = createStackNavigator(); 

export default function App() {
  return (
    <NavigationContainer> 
      <Navigation />
    </NavigationContainer>
  );
}