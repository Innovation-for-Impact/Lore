import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import ProfileScreen from '../screens/ProfileScreen';
import { ProfileEditScreen } from '../screens/ProfileEditScreen';

const Stack = createStackNavigator<RootStackParamList>();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
