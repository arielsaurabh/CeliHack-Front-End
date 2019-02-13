import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

export const DoneButton = ({
  styles, onDoneBtnClick, onNextBtnClick,
  rightTextColor, isDoneBtnShow,
  doneBtnLabel, nextBtnLabel,
}) => {
  return (
    <View style={[styles.btnContainer, { height: 0, paddingBottom: 5 }]}>
      <TouchableOpacity style={styles.full}
        onPress={ isDoneBtnShow ? onDoneBtnClick : onNextBtnClick}
      >
       <Text style={[ isDoneBtnShow ? styles.controllText : styles.nextButtonText, { color: isDoneBtnShow ? "#74cdc1" : rightTextColor, paddingRight: 5 }]}>
         {isDoneBtnShow ? doneBtnLabel : nextBtnLabel}
       </Text>
      </TouchableOpacity>
    </View>
  )
}

export default DoneButton