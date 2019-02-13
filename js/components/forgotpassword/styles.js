
'use strict';

import loginTheme from './login-theme';

var React = require('react-native');

var { StyleSheet, Platform } = React;

module.exports = StyleSheet.create({
    shadow: {
        width: 200,
        height: 200,
    },
    inputContainer: {
        paddingHorizontal: 20,
        width: 300
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
        width:200,
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
