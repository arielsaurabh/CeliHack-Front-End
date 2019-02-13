'use strict';

import React, { Component } from 'React';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './configureStore'
import UXCam from 'react-native-ux-cam';

function runOnStartUp() {

    // Initialize using your app key.
    UXCam.startWithKey("cad108a0df723a0");

    // // Add a custom tag with properties.
    //     UXCam.addTag('logged-in', {
    //         isLoggedIn: true,
    //         isAwesome: true,
    //     });
    //
    // // Mark a session as a favorite.
    //     UXCam.markSessionAsFavorite();
    //
    // // Get the url for the current user. Useful for connecting to other
    // // analytics services. Note, this method is async and returns a promise.
    //     const currentUserUrl = await UXCam.urlForCurrentUser();
    //
    // // Get the url for the current session. Note, this method is also async.
    //     const currentSessionUrl = await UXCam.urlForCurrentSession();

    console.log("\n\n\n\nfirst\n\n\n\n");
}

function setup():React.Component {

    class Root extends Component {

        constructor() {
            super();
            this.state = {
                isLoading: false,
                store: configureStore(()=> this.setState({isLoading: false})),
            };

            runOnStartUp();
        }

        render() {
            return (
                <Provider store={this.state.store}>
                    <App store={this.state.store} />
                </Provider>
            );
        }
    }
    return Root
}

export default setup;
