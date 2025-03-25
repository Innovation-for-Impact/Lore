import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/RegistrationScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import CreateAccountEmailScreen from '../screens/CreateAccountEmailScreen';
import LoginScreen from '../screens/LoginScreen';
import NameScreen from '../screens/NameScreen';

const Stack = createStackNavigator();

function RegistrationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="RegistrationScreen"
        component={RegistrationScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateAccountScreen" 
        component={CreateAccountScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateAccountEmailScreen"
        component={CreateAccountEmailScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="NameScreen"
        component={NameScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default RegistrationStack;