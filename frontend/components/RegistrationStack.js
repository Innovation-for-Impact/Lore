import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/RegistrationScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import LoginScreen from '../screens/LoginScreen';
import Welcome from '../screens/Welcome';

const Stack = createStackNavigator();

function RegistrationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Welcome" 
        component={Welcome} 
        options={{ headerShown: false }}
      />
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
    </Stack.Navigator>
  );
}

export default RegistrationStack;
