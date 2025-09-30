import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CommunityScreen from '../screens/CommunityScreen';
import QuoteBoardScreen from '../screens/QuoteBoardScreen';
import MemoryBoardScreen from '../screens/MemoryBoardScreen';
import AchievementBoardScreen from '../screens/AchievementBoardScreen';
import QuoteDetailScreen from '../screens/QuoteEditScreen';

// Define type for your stack params
export type CommunityStackParamList = {
  CommunityScreen: undefined;
  QuoteBoardScreen: undefined;
  MemoryBoardScreen: undefined;
  AchievementBoardScreen: undefined;
  QuoteDetailScreen: undefined;
};

const Stack = createStackNavigator<CommunityStackParamList>();

function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CommunityScreen"
        component={CommunityScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="QuoteBoardScreen"
        component={QuoteBoardScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MemoryBoardScreen"
        component={MemoryBoardScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AchievementBoardScreen"
        component={AchievementBoardScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuoteDetailScreen"
        component={QuoteDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default CommunityStack;
