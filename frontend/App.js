import { React, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navigation from './components/Navigation';
import RegistrationStack from './components/RegistrationStack';

const Stack = createStackNavigator(); 

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check for a stored user using AsyncStorage
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    checkUser();
  }, []); // runs useEffect once on component's first render

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer> 
        <Stack.Navigator>
          {!user ? (
            <Stack.Screen name="Registration" component={RegistrationStack} options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="Navigation" component={Navigation} options={{ headerShown: false }} 
        />
          )}
        </Stack.Navigator>
      </NavigationContainer>
  </SafeAreaProvider>
  );
}