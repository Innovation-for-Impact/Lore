import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import GroupCreationScreen from '../screens/GroupCreationScreen';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen"
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="GroupCreationScreen" 
        component={GroupCreationScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
