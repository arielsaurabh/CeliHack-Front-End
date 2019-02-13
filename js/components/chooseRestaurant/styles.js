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
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 20
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
  itemTextAddress: {
    fontSize: 12,
    color: 'grey',
    margin: 2
  },
  info: {
    paddingTop: 60,
    flex: 4
  },
  infoText: {
    textAlign: 'center'
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center'
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center'
  },
  openingText: {
    textAlign: 'center'
  },
});
