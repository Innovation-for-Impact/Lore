import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WorkSans from './assets/fonts/WorkSans-VariableFont_wght.ttf';
import { UserProvider } from './context/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './navigation/RootNavigator';

const queryClient = new QueryClient();

export default function App() {
  // global font
  const [fontsLoaded] = useFonts({
    'Work Sans': WorkSans,
  });

  if (!fontsLoaded) return null;

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#B2B0E6'
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <NavigationContainer theme={MyTheme}>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
