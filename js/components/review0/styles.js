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
    titleText:{
      fontSize:20,
      fontWeight:'bold',
      color: '#FFF'
    },
    _col:{
      marginTop: 0,
      marginBottom:10,
      flex: 4.2
    },
    _emoji1:{
        width:40,
        height:30,
        marginLeft:20,
        marginRight:20
    },
    _emoji2:{
        width:30,
        height:30
    },
    _view1:{
      flex:1,
      flexDirection:'row',
      marginTop:15,
      justifyContent:'flex-end'
    },
   
    _view2:{
      height:150,
      borderWidth:1,
      
      paddingBottom: 15,
      marginTop:15,
      marginBottom:15
    },
    _view3:{
      flexDirection:'row',
      marginTop:10,
      marginBottom:10,
      justifyContent:'flex-end'
    },
    _allReview:{
      marginRight:10,
      color:theme.iconColor
    }
});
