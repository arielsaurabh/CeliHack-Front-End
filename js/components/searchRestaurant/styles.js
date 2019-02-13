'use strict';

var React = require('react-native');

var { StyleSheet, Platform } = React;

import theme from '../../themes/base-theme';

module.exports = StyleSheet.create({
    titleArrow:{
      fontSize: 35,
      lineHeight: 35,
      color:'#fff'
    },
    _titleText: {
		fontSize:20,
		fontWeight:'bold',
    textAlign:'center',
		color: '#FFF'
	},
    _iconDelete:{
      fontSize:40,
      color:'#74cdc1'
    },
    _icon:{
      fontSize:30,
      color:'#74cdc1'
    },
    _text:{
      color:'#AAA',
      fontSize:12
    },
    _text2:{
      color:'#74cdc1',
      fontSize:12,
    },
    _mainImage:{
      width:130,
      height:110
    },
    _emojiImage1:{
      width:25,
      height:20
    },
    _alignCol: {
      alignItems:'center',
      justifyContent:'center'
    },
    _emojiImage2:{
      width:20,
      height:20
    },
    _colItem:{
      alignItems:'center',
      justifyContent:'center'
    }
});
