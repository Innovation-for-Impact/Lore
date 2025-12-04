import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Background Color
const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFB0E4',
  },
});

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

export { navigationStyles, globalStyles };
