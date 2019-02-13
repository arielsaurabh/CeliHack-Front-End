'use strict';

var React = require('react-native');

var { StyleSheet } = React;

import theme from '../../themes/base-theme';
var { Dimensions } = React;
var devWidth = Dimensions.get('window').width;
var devHeight = Dimensions.get('window').height;
module.exports = StyleSheet.create({
    titleArrow:{
      fontSize: 35,
      lineHeight: 35
    },
    avatarImage:{
      width:120,
      height:120
    },
    emoji1:{
      width:40,
      height:30,
      marginLeft:20,
      marginRight:20
    },
    priceView:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'flex-end',
      height:40,
      borderWidth:1,
      borderColor:'#AAA',
      marginTop:5
    },
    priceImage:{
      width:30,
      height:25,
      marginRight:5
    },
    emoji2:{
      width:30,
      height:30
    },
    _contentView:{
      flex:1,
      backgroundColor:'#fff',
      padding:10,
      flexDirection:'column',
    },
    _foodCategory:{
      marginTop:5,
      borderWidth:1,
      height:40,
      borderColor: '#aaa',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center'
    },
    _foodCategoryText:{
      marginRight:10,
      textAlign:'right',
      color:'#aaa'
    },
    _foodCategoryTextMain:{
      marginRight:10,
      textAlign:'right',
      width:devWidth*.8,
      color:'#000'
    },
     _foodAddress:{
      marginTop:5,
      borderWidth:1,
      height:40,
      borderColor: '#aaa',
      flexDirection:'row',
      justifyContent:'flex-end',
      alignItems:'center'
    },
    _foodAddressText:{
      marginRight:10,
      textAlign:'right',
      color:'#aaa'
    },
    _foodAddressTextMain:{
      marginRight:10,
      marginLeft:10,
      textAlign:'right',
      width:devWidth*.8,
      color:'#000'
    },
    _emojiView:{
      flex: 1,
      justifyContent: 'center',
      flexDirection:'row',
      alignItems:'center',
      margin:10
    },
    checkboxView:{
      flexDirection:'row',
      justifyContent:'flex-end',
      marginTop:10,
      marginBottom:10
    },
});
