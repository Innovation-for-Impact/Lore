import React from 'react';
import { Platform, View } from 'react-native';
import { BlurView as NativeBlurView } from '@react-native-community/blur';

// Define props to accept both NativeBlurView and View props
type BlurViewProps = React.ComponentProps<typeof NativeBlurView> &
  React.ComponentProps<typeof View>;

const BlurView: React.FC<BlurViewProps> = (props) => {
  if (Platform.OS === 'web') {
    return (
      <View {...props} style={[props.style, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
        {props.children}
      </View>
    );
  }
  return <NativeBlurView {...props} />;
};

export default BlurView;


