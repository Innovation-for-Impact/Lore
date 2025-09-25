import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './components/Navigation';
import RegistrationStack from './components/RegistrationStack';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(false);

  // global font
  const [fontsLoaded] = useFonts({
    'Work Sans': require('./assets/fonts/WorkSans-VariableFont_wght.ttf'),
  });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!user ? (
            <Stack.Screen name="Registration" options={{ headerShown: false }}>
              {(props) => <RegistrationStack {...props} setUser={setUser} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen
              name="Navigation"
              component={Navigation}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
