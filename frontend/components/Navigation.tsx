import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommunityStack from './CommunityStack';
import HomeStack from './HomeStack';
import ProfileScreen from '../screens/ProfileScreen';
import { navigationStyles } from '../styles/global';

type RootTabParamList = {
  Community: undefined;
  Home: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const { width } = Dimensions.get('window');

function Navigation() {
  const insets = useSafeAreaInsets();
  const tabBarWidth = width * 0.7;

  return (
    <View style={navigationStyles.container}>
      <View style={navigationStyles.contentContainer}>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({ color, focused }) => {
              let size = 28;
              const iconName: keyof typeof Ionicons.glyphMap =
                route.name === 'Community' ? focused ?
                  'compass' : 'compass-outline'
                  : route.name === 'Home' ? focused ?
                      'home' : 'home-outline'
                    : route.name === 'Profile' ? focused ?
                'person' : 'person-outline' : 'compass';

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarInactiveTintColor: '#000',
            tabBarActiveTintColor: '#000',
            tabBarShowLabel: false,
            tabBarStyle: {
              position: 'absolute',
              bottom: insets.bottom + 10,
              width: tabBarWidth,
              marginLeft: (width - tabBarWidth) / 2,
              borderRadius: 15,
              paddingTop: 10,
              height: 60,
              backgroundColor: 'white',
              shadowColor: '#000', // shadow for iOS
              elevation: 5, // shadow for Android
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }
            // headerShown: false,
          })}
        >
          <Tab.Screen name="Community" component={CommunityStack} />
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </View>
    </View>
  );
}

export default Navigation;
