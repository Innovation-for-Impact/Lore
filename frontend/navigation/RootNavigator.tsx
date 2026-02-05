import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUser } from "../context/UserContext";
import Navigation from "./Navigation";
import { RootStackParamList } from "./NavigationParams";
import { RegistrationNavigator } from "./Navigators";
import { NavigationProp } from "@react-navigation/native";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user } = useUser();

  return (
    <RootStack.Navigator>
      {!user ? (
        <RootStack.Screen name="Auth" options={{ headerShown: false }} component={RegistrationNavigator} />
      ) : (
        <RootStack.Screen
          name="Navbar"
          component={Navigation}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>
  );
}

export type RootNavigation = NavigationProp<RootStackParamList>;
