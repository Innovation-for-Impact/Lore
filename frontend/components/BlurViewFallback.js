import { Platform, View } from 'react-native';
import { BlurView as NativeBlurView } from '@react-native-community/blur';

const BlurView = (props) => {
  if (Platform.OS === 'web') {
    // Return a basic semi-transparent View for web.
    return (
      <View {...props} style={[props.style, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
        {props.children}
      </View>
    );
  }
  return <NativeBlurView {...props} />;
};

export default BlurView;
