import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Animated
} from 'react-native';

export const SkipButton = ({
  styles, onSkipBtnClick, isSkipBtnShow,
  leftTextColor,
  skipBtnLabel,
  skipFadeOpacity
}) => {
  return (
    <View style={[styles.leftBtnContainer, {
        paddingBottom: 5,
        paddingLeft:5,
        opacity: isSkipBtnShow ? 1 : 0,
      }]}>
      <TouchableOpacity
        style={styles.skipfull}
        onPress={isSkipBtnShow ? () => onSkipBtnClick() : null}>
        <Text style={[styles.controllText, { color: leftTextColor }]}>
          {skipBtnLabel}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default SkipButton
