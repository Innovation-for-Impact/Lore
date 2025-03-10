import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { navigationStyles, getTabBarStyle } from '../styles/global';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

function Navigation() {
    const insets = useSafeAreaInsets();
    const tabBarWidth = width * 0.7;

    return (
        <View style={navigationStyles.container}>
            {/* Main Content */}
            <View style={navigationStyles.contentContainer}>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ color, focused }) => {
                            let iconName;
                            let size = 28;

                            switch (route.name) {
                                case 'Community':
                                    iconName = focused ? 'compass' : 'compass-outline';
                                    break;
                                case 'Home':
                                    iconName = focused ? 'home' : 'home-outline';
                                    break;
                                case 'Profile':
                                    iconName = focused ? 'person' : 'person-outline';
                                    break;
                            }

                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                        tabBarInactiveTintColor: '#000',
                        tabBarActiveTintColor: '#000',
                        tabBarShowLabel: false,
                        tabBarStyle: getTabBarStyle(insets, tabBarWidth),
                    })}
                >
                    <Tab.Screen name="Community" component={CommunityScreen} />
                    <Tab.Screen name="Home" component={HomeScreen} />
                    <Tab.Screen name="Profile" component={ProfileScreen} />
                </Tab.Navigator>
            </View>
        </View>
    );
}

export default Navigation;