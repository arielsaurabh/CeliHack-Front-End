'use strict';

var React = require('react-native');

var { StyleSheet, Dimensions, Platform } = React;

var deviceHeight = Dimensions.get('window').height;

var deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  titleArrow:{
    fontSize: 35,
    lineHeight: 35
  },
});
