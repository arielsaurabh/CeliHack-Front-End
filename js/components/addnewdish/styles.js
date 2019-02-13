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
    autocompleteContainer: {
      flex: 1,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 20
    },
    itemText: {
      fontSize: 15,
      margin: 2
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
      justifyContent:'center',
      height:40,
      borderWidth:1,
      borderColor:'#AAA',
      marginTop:5
    },
    priceImage:{
      width:30,
      height:25,
      marginLeft:5
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
      marginLeft:10,
      color:'#aaa'
    },
    _foodCategoryTextMain:{
      marginLeft:10,
      width: devWidth*.8,
      color:'#000'
    },
    _foodAddress:{
      marginTop:5,
      borderWidth:1,
      height:40,
      borderColor: '#aaa',
      flexDirection:'row',
      alignItems:'center'
    },
    _foodAddresText:{
      marginLeft:10,
      color:'#aaa'
    },
     _foodAddresTextMain:{
      marginLeft:10,
      marginRight:10,
      width: devWidth * .8,
      color:'#000',
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
      marginTop:10,
      marginBottom:10
    },
});
