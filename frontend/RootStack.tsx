// RootStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from './context/UserContext';
import Navigation from './components/Navigation';
import RegistrationStack from './components/RegistrationStack';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { user } = useUser();

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Registration" options={{ headerShown: false }} component={RegistrationStack}/>
      ) : (
        <Stack.Screen
          name="Navigation"
          component={Navigation}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
