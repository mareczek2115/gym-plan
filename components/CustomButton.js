import React from 'react';
import { TouchableNativeFeedback, Text, View } from 'react-native';

const CustomButton = props => {
  const { text, onPress, style } = props;

  return (
    <TouchableNativeFeedback
      onPress={() => onPress()}
      background={TouchableNativeFeedback.Ripple('#a0a0a0', false)}
    >
      <View style={style}>
        <Text
          style={{
            fontSize: 14,
            color: 'black',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

export default CustomButton;
