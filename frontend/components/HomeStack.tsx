import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import GroupInfoScreen from '../screens/GroupInfoScreen';
import EditGroupScreen from '../screens/GroupEditScreen';
import { RootStackParamList } from '../types/navigation';

// Define type for your stack params

const Stack = createStackNavigator<RootStackParamList>();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupInfoScreen"
        component={GroupInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupEditScreen"
        component={EditGroupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
