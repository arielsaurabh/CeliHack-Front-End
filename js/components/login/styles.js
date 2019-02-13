
'use strict';

import loginTheme from './login-theme';

var React = require('react-native');

var { StyleSheet, Platform } = React;
var { Dimensions } = React;
var devWidth = Dimensions.get('window').width;
module.exports = StyleSheet.create({
    shadow: {
        width: devWidth * .5,
        height: devWidth * .5,
    },
    inputContainer: {
        paddingHorizontal: 20,
        width: devWidth * .7
    },
    guestBtn: {
        height: 30,
        marginTop: 25,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    login: {
        alignSelf: 'center',
        backgroundColor: loginTheme.darkenButton,
        paddingHorizontal: 40,
        marginTop:10
    },
    logoButton: {
        paddingHorizontal: 50,
        borderRadius:4,
        height: 40,
        padding: 4
    },
    transparentButton: {
        padding: 0,
        alignItems: 'flex-start'
    }
});
