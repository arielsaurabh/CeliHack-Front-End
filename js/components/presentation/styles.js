'use strict';

var React = require('react-native');

var { StyleSheet } = React;

import theme from '../../themes/base-theme';

module.exports = StyleSheet.create({
    titleArrow:{
      fontSize: 40,
      lineHeight: 40
    },
    _align:{
      alignItems:'center',
      justifyContent:'center'
    },
    _toolbarText:{
      fontSize:12,
      color:'#FFF'
    },
    _col1:{
      flex:1.2,
      alignItems:'center',
      justifyContent:'center'
    },
    _userProfile:{
      width:24,
      height:21
    },
    _col2:{
      flex:4,
      alignItems:'center',
      justifyContent:'center'
    },
    _col3:{
      flex:10,
      marginLeft:15
    },
    _mainTransImage:{
      width:theme.width,
      height:39,
      justifyContent:'center',
      alignItems:'center'
    },
    _mainImage:{
      flex:1,
      flexDirection:'column',
      width:theme.width*0.8,
      height:180
    },
    _icon1:{
      marginLeft:15,
      fontSize:20,
      color:'#74cdc1'
    },
    _row:{
      flex:1,
      padding:15
    },
    _rowPrice:{
      flex:1,
      backgroundColor: '#eee',      
      padding:10
    },
    _rowAddress:{
      flex:1,
      padding:15,
      marginBottom: 10,
    },
    _rowUser:{
      flex:1,
      backgroundColor: '#eee',
      padding:10
    },
    _rowReview:{
      flex:1,
      backgroundColor: '#74CDC1',
      padding:10,
    },
    _rowReviews:{
      flex:1,
      padding:10
    },
    _review:{
      flex:1,
      flexDirection:'row',
      alignItems:'center'
    },
    _iconReview:{
      fontSize:23,
      color:'#fff'
    },
    _textReview:{
      marginLeft:15,
      color:'#aaa'
    },
    _textReview1:{
      color:'#fff',
      fontSize:18,
      marginBottom:5
    },
    _reviewTitle:{
      flex:3,
      marginLeft:10,
      color:'#999',
      fontSize:14
    },
    _reviewContent:{
      flex:10,
      marginLeft:10,
      color:'#aaa',
      fontSize:13
    },
    _viewMore:{
      flex:1,
      justifyContent:'center'
    },
    _emojiImage1:{
      width:40,
      height:30
    },
    _emojiImage2:{
      width:30,
      height:30
    },
    _priceImage:{
      width:26,
      height:21
    },
    _toolbarImage:{
      width:24,
      height:24
    },
});
