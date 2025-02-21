import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from "@expo/vector-icons";
import {Text, StyleSheet} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { styles } from '../styles/global';

const Tab = createBottomTabNavigator();

function Navigation() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size, focused }) => {
                let iconName;

                switch (route.name) {
                    case "Community":
                        iconName = focused ? "compass" :
                        "compass-outline";
                        break;
                    case "Home":
                        iconName = focused ? "home" :
                        "home-outline";
                        break;
                    case "Profile":
                        iconName = focused ? "person" :
                        "person-outline";
                        break;
                }

                return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarLabel: ({children, color, focused}) => (<Text>
                {/* style={{
                    fontSize: 10,
                    color,
                    fontWeight: focused ? "bold" : "normal",
                }} */}
                {children}
            </Text>),
            // tabBarStyle: styles.bottomNavigation,
        })}
    >
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default Navigation;