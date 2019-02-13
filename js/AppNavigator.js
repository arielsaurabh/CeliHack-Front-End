'use strict';

import React, { Component } from 'react';
import { BackAndroid, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash/core';
import { popRoute } from './actions/route';
import Navigator from 'Navigator';
import {Drawer} from 'native-base';
import Login from './components/login/';
import SignUp from './components/signup';
import SplashPage from './components/splashscreen/';
import WalkThrough from './components/walkthrough/';
import Home from './components/home/';
import Home0 from './components/home0/';
import AddNewDish from './components/addnewdish/';
import AddNewDish0 from './components/addnewdish0/';
import Presentation from './components/presentation/';
import Presentation0 from './components/presentation0/';
import Category from './components/categories/';
import Category0 from './components/categories0/';
import Favourite from './components/favourite/';
import Favourite0 from './components/favourite0/';
import ChooseCategory from './components/chooseCategory/';
import ChooseCategory0 from './components/chooseCategory0/';
import ChooseAddress from './components/chooseAddress/';
import ChooseAddress0 from './components/chooseAddress0/';
import ChooseRestaurant from './components/chooseRestaurant/';
import ChooseRestaurant0 from './components/chooseRestaurant0/';
import InnerCategory from './components/innerCategory/';
import InnerCategory0 from './components/innerCategory0/';
import Review from './components/review/';
import Review0 from './components/review0/';
import ViewMoreReview from './components/viewMoreReview/';
import ViewMoreReview0 from './components/viewMoreReview0/';
import ForgotPassword from './components/forgotpassword/'

import ChangeLocation from './components/changeLocation/';
import ChangeLocation0 from './components/changeLocation0/';

import ChangeLocationHome from './components/changeLocationHome/';
import ChangeLocationHome0 from './components/changeLocationHome0/';

import SearchRestaurant from './components/searchRestaurant/';
import SearchRestaurant0 from './components/searchRestaurant0/';

import SearchRestaurantHome from './components/searchRestaurantHome/';
import SearchRestaurantHome0 from './components/searchRestaurantHome0/';
import { statusBarColor } from './themes/base-theme';

import UXCam from 'react-native-ux-cam';


Navigator.prototype.replaceWithAnimation = function (route) {
    const activeLength = this.state.presentedIndex + 1;
    const activeStack = this.state.routeStack.slice(0, activeLength);
    const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
    const nextStack = activeStack.concat([route]);
    const destIndex = nextStack.length - 1;
    const nextSceneConfig = this.props.configureScene(route, nextStack);
    const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);

    const replacedStack = activeStack.slice(0, activeLength - 1).concat([route]);
    this._emitWillFocus(nextStack[destIndex]);
    this.setState({
        routeStack: nextStack,
        sceneConfigStack: nextAnimationConfigStack,
    }, () => {
        this._enableScene(destIndex);
        this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity, null, () => {
            this.immediatelyResetRouteStack(replacedStack);
        });
    });
};
import Global from './Global';
export var globalNav = {};

const searchResultRegexp = /^search\/(.*)$/;

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        var currentState = state;

        if(currentState){
            while (currentState.children){
                currentState = currentState.children[currentState.index]
            }
        }
        return defaultReducer(state, action);
    }
};

class AppNavigator extends Component {
    constructor(props){
        super(props);
        console.disableYellowBox = true;

    }
    componentDidMount() {
        globalNav.navigator = this._navigator;
        BackAndroid.addEventListener( 'hardwareBackPress', () => {
            var routes = this._navigator.getCurrentRoutes();
            if ( routes[routes.length - 1].id == 'home' || routes[routes.length - 1].id == 'login') {
                return false;
            }
            else {
                this.popRoute();
                return true;
            }
        });
    }

    popRoute() {
        this.props.popRoute();
    }

    render() {

        let firstScreen = 'splashscreen';

        // Tag a screen.
        UXCam.tagScreenName(firstScreen);

        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                tapToClose={true}
                acceptPan={false}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan={true}>
                <StatusBar
                    backgroundColor={statusBarColor}
                    barStyle="light-content"
                />

                <Navigator
                    ref={(ref) => this._navigator = ref}
                    configureScene={(route) => {
                        return Navigator.SceneConfigs.FadeAndroid;
                    }}
                    initialRoute={{id: firstScreen, statusBarHidden: true}}
                    // initialRoute={{id: (Platform.OS === 'android') ? 'splashscreen' : 'login', statusBarHidden: true}}
                    renderScene={this.renderScene}
                />
            </Drawer>
            
        );
    }

    renderScene(route, navigator) {

        // Tag a screen.
        UXCam.tagScreenName(route.id);

        switch (route.id) {
            case 'splashscreen':
                return <SplashPage navigator={navigator} {...route.passProps}/>;
            case 'login':
                return <Login navigator={navigator} {...route.passProps}/>;
            case 'walkthrough':
                return <WalkThrough navigator={navigator} {...route.passProps}/>;
            case 'forgotpw':
                return <ForgotPassword navigator={navigator} {...route.passProps}/>;
            case 'signup':
                return <SignUp navigator={navigator} {...route.passProps}/>;
            case 'home':
                return <Home navigator={navigator} {...route.passProps}/>;
            case 'home0':
                return <Home0 navigator={navigator} {...route.passProps}/>;
            case 'addnewdish':
                return <AddNewDish navigator={navigator} {...route.passProps}/>;
            case 'addnewdish0':
                return <AddNewDish0 navigator={navigator} {...route.passProps}/>;
            case 'presentation':
                return <Presentation navigator={navigator} {...route.passProps}/>;
            case 'presentation0':
                return <Presentation0 navigator={navigator} {...route.passProps}/>;
            case 'categories':
                return <Category navigator={navigator} {...route.passProps}/>;
            case 'categories0':
                return <Category0 navigator={navigator} {...route.passProps}/>;
            case 'innerCategory':
                return <InnerCategory navigator={navigator} {...route.passProps} />;
            case 'innerCategory0':
                return <InnerCategory0 navigator={navigator} {...route.passProps} />;
            case 'favourite':
                return <Favourite navigator={navigator} {...route.passProps}/>;
            case 'favourite0':
                return <Favourite0 navigator={navigator} {...route.passProps}/>;
            case 'chooseAddress':
                return <ChooseAddress navigator={navigator} {...route.passProps}/>;
            case 'chooseAddress0':
                return <ChooseAddress0 navigator={navigator} {...route.passProps}/>;
            case 'chooseCategory':
                return <ChooseCategory navigator={navigator} {...route.passProps}/>;
            case 'chooseCategory0':
                return <ChooseCategory0 navigator={navigator} {...route.passProps}/>;
            case 'chooseRestaurant':
                return <ChooseRestaurant navigator={navigator} {...route.passProps}/>;
            case 'chooseRestaurant0':
                return <ChooseRestaurant0 navigator={navigator} {...route.passProps}/>;
            case 'review':
                return <Review navigator={navigator} {...route.passProps}/>;
            case 'review0':
                return <Review0 navigator={navigator} {...route.passProps}/>;
            case 'viewMoreReview':
                return <ViewMoreReview navigator={navigator} {...route.passProps}/>;
            case 'viewMoreReview0':
                return <ViewMoreReview0 navigator={navigator} {...route.passProps}/>;
            case 'changeLocation':
                return <ChangeLocation navigator={navigator} {...route.passProps}/>;
            case 'changeLocation0':
                return <ChangeLocation0 navigator={navigator} {...route.passProps}/>;
            case 'changeLocationHome':
                return <ChangeLocationHome navigator={navigator} {...route.passProps}/>;
            case 'changeLocationHome0':
                return <ChangeLocationHome0 navigator={navigator} {...route.passProps}/>;
            case 'searchRestaurant':
                return <SearchRestaurant navigator={navigator} {...route.passProps}/>;
            case 'searchRestaurant0':
                return <SearchRestaurant0 navigator={navigator} {...route.passProps}/>;
            case 'searchRestaurantHome':
                return <SearchRestaurantHome navigator={navigator} {...route.passProps}/>;
            case 'searchRestaurantHome0':
                return <SearchRestaurantHome0 navigator={navigator} {...route.passProps}/>;
            default :
                return <Login navigator={navigator}  {...route.passProps}/>;
        }
    }
}
function bindAction(dispatch) {
    return {
        popRoute: () => dispatch(popRoute())
    }
}

export default connect(null, bindAction) (AppNavigator);
