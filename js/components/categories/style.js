'use strict';

import theme from '../../themes/base-theme';

var React = require('react-native');

var { StyleSheet, Dimensions } = React;

var devWidth = Dimensions.get('window').width;
var devHeight = Dimensions.get('window').height;

module.exports = StyleSheet.create({
    titleArrow:{
      fontSize: 35,
      lineHeight: 35
    },
    titleText:{
      fontSize:20,
      fontWeight:'bold',
      color: '#FFF'
    },
    categoryImage:{
      flexDirection:'row',
      width: devWidth/2-10,
      height: devHeight/5,
      borderWidth:1,
      borderRadius:5,
      borderColor:'#AAA',
      justifyContent:'center',
      marginLeft:5,
      marginTop:5,
      marginRight:5
    },
    categoryView:{
      flex:1,
      flexDirection:'row',
      width: devWidth/2-10,
      height: devHeight/5,
      borderWidth:1,
      borderRadius:5,
      borderColor:'#AAA',
      justifyContent:'center',
      alignItems:'center'
    },
    categoryText:{
      color:'#fff',
      fontSize:20,
      fontWeight:'bold',
    },
    colAlign:{
      alignItems:'center',
      justifyContent:'center',
    }
});
