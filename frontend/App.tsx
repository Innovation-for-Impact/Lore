import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WorkSans from './assets/fonts/WorkSans-VariableFont_wght.ttf';
import { UserProvider } from './context/UserContext';
import RootStack from './RootStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

export default function App() {
  // global font
  const [fontsLoaded] = useFonts({
    'Work Sans': WorkSans,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
