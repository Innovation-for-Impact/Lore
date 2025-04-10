import { createStackNavigator } from '@react-navigation/stack';
import CommunityScreen from '../screens/CommunityScreen';
import QuoteBoardScreen from '../screens/QuoteBoardScreen';
import MemoryBoardScreen from '../screens/MemoryBoardScreen';
import AchievementBoardScreen from '../screens/AchievementBoardScreen';
import QuoteDetailScreen from '../screens/QuoteDetailScreen';

const Stack = createStackNavigator();

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