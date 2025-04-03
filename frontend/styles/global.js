import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Navigation Styling
const navigationStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
      flex: 1,
  },
});

const getTabBarStyle = (insets, tabBarWidth) => ({
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
});

export { navigationStyles, getTabBarStyle };