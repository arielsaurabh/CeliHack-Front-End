'use strict';

import React, { Component } from 'react';

import { Image, View, Platform, TouchableOpacity, AsyncStorage} from 'react-native';
import { connect } from 'react-redux';
import Global from '../../Global';
import { USER_ID, LANGUAGE } from '../../Constants';
import UXCam from 'react-native-ux-cam';
var Analytics = require('react-native-firebase-analytics');

var navigator;

export default class SplashPage extends Component {
    componentWillMount () {
        navigator = this.props.navigator;
        Analytics.logEvent('app_open', null);
        setTimeout (() => {
            AsyncStorage.getItem(USER_ID)
            .then( (value) => {

                try {
                    let nextScreen = 'walkthrough'; // Default value.
                    let isLoggedInUser = false;

                    if (value != null) {
                        Global.user_id = parseInt(value);
                        Analytics.setUserId('' + Global.user_id);
                        Analytics.setUserProperty('propertyName', 'user');

                        // Tag a user.
                        UXCam.tagUserName('' + Global.user_id);
                        isLoggedInUser = true;

                        AsyncStorage.getItem(LANGUAGE)
                            .then((value) => {
                                Global.lang = value;
                                if (Global.lang === 'En') {
                                    nextScreen = 'home';
                                } else {
                                    nextScreen = 'home0';
                                }

                                this.continueToNextScreen(nextScreen, isLoggedInUser);
                            });
                    } else {
                        nextScreen = 'walkthrough';

                        this.continueToNextScreen(nextScreen, isLoggedInUser);
                    }

                } catch(err) {
                    console.log('\n\n\nError:\n' + err.message + '\n\n\n');
                }
            });
        }, 1000);        
    }

    continueToNextScreen(nextScreen, isLoggedInUser) {

        // Add a custom tags with properties.
        let strToLog = '\n\n\nisLoggedInUser: ' + isLoggedInUser.toString() +
            '\nnextScreen: ' + nextScreen +
            '\nGlobal.user_id: ' + Global.user_id;

        UXCam.addTag('isLogged_In', {
            isLoggedIn: isLoggedInUser.toString(),
        });

        if(isLoggedInUser) {
            // // Add a custom tag with properties.
            // console.log('\n\n\ntheLanguage: ' + Global.lang.toString() + '\n\n\n');
            UXCam.addTag('theLanguage', {
                language: Global.lang.toString(),
            });

            strToLog += '\nGlobal.lang: ' + Global.lang.toString();
        }

        console.log(strToLog + '\n\n\n');

        navigator.replace({id: nextScreen});
    }

    render () {
        return (
            <Image source={require('../../../images/launchscreen.png')} style={{flex: 1, height: null, width: null}} />
        );
    }
}
