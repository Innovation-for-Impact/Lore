import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AchievementBoardScreen from '../screens/AcheivementScreens/AchievementBoardScreen';
import CommunityScreen from '../screens/CommunityScreen';
import MemoryBoardScreen from '../screens/MemoryBoardScreen';
import QuoteBoardScreen from '../screens/QuoteBoardScreen';
import QuoteDetailScreen from '../screens/QuoteEditScreen';
import ChallengeListScreen from "../screens/ChallengeScreens/ChallengeListScreen";
import ChallengeDetailScreen from "../screens/ChallengeScreens/ChallengeDetailScreen";
import ChallengeCreateScreen from "../screens/ChallengeScreens/ChallengeCreateScreen";
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
      <Stack.Screen
        name="ChallengeList"
        component={ChallengeListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChallengeDetail"
        component={ChallengeDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateChallenge"
        component={ChallengeCreateScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default CommunityStack;
