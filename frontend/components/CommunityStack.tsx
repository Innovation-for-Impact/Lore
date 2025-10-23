import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AchievementBoardScreen from '../screens/AcheivementScreens/AchievementBoardScreen';
import CommunityScreen from '../screens/CommunityScreen';
import MemoryBoardScreen from '../screens/MemoryBoardScreen';
import QuoteBoardScreen from '../screens/QuoteBoardScreen';
import QuoteDetailScreen from '../screens/QuoteEditScreen';
import { RootStackParamList } from '../types/navigation';

// Define type for your stack params

const Stack = createStackNavigator<RootStackParamList>();

function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CommunityScreen"
        component={CommunityScreen} 
        options={{ headerShown: true }}
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
