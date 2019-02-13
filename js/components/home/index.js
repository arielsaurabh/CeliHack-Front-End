'use strict';

import React, { Component } from 'react';
import { Platform, Modal, View, Text, TouchableOpacity, TouchableHighlight, Image, Dimensions, Alert, AsyncStorage, Linking, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import { popRoute, replaceRoute, pushNewRoute } from '../../actions/route';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import { Container, Header, Footer, Content, Icon, Spinner, Button } from 'native-base';
import { Grid, Col, Row } from "react-native-easy-grid";
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import SwipeCards from '../swipecards';

import theme from '../../themes/base-theme';
import styles from './styles';

import { TOKEN, USER_ID } from '../../Constants';
import Global from '../../Global';
import Util from '../../utils.js';
import showIf from '../../utils/showIf';
import HideableView from 'react-native-hideable-view';

var devWidth = Dimensions.get('window').width;
var devHeight = Dimensions.get('window').height;
var _this;

var Analytics = require('react-native-firebase-analytics');

let Card = React.createClass({
    render() {
        var dishID = this.props.id;
        Global.dish_id = dishID;
        var restaurantLat = this.props.Latitude;
        var restaurantLng = this.props.Longitude;
        let distance;
        if (Global.current_lat === 0) {
            distance = 'calculating...'
        } else {
            distance = '' + Math.round(Util.getDistanceFromLatLonInKm(Global.current_lat, Global.current_lng, restaurantLat, restaurantLng)) + ' km away';
        }

        return (
            <TouchableOpacity onPress={() => _this.gotoPresentation(dishID)}>
                <View style={styles.card}>
                    <View style={styles.thumbnail}>
                        <Image style={styles._cardMainImage} resizeMode={'stretch'} source={{ uri: this.props.Image }}>
                            <Image style={styles._cardSubImage} resizeMode={'stretch'} source={require('../../../images/transparent_bar.png')}>
                                <View style={styles._cardSubImageView3}>
                                    <Image style={{ marginLeft: 10, width: devWidth * .07, height: devWidth * .07 }}
                                        resizeMode={'stretch'}
                                        source={require('../../../images/comment_icon.png')} />
                                    <Text style={styles._cardSubTextReview}>{this.props.ReviewCount}</Text>
                                </View>
                            </Image>
                        </Image>
                    </View>
                    <View>
                        <View style={styles._cardDishNameView}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <Text numberOfLines={1} style={{ flex: 7, marginLeft: 5, }}>{this.props.DishName}</Text>
                                <Text numberOfLines={1} style={{ flex: 3, marginRight: 5, textAlign: 'right', color: '#74cdc1', textDecorationLine: 'underline' }}>{distance}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name='ios-pin' style={styles._cardDishNameIcon} />
                                <Text numberOfLines={1} style={{ width: devWidth * .75, marginLeft: 5, fontSize: 15, marginBottom: 2 }}>{this.props.RestaurantName}</Text>
                            </View>
                            <View style={{ flex: .5, flexDirection: 'row', alignItems: 'center' }} />
                            <View style={[styles._alignCol, { flex: 1, flexDirection: 'row', }]}>
                                <Button rounded style={{ width: theme.devWidth * .2, height: null }} onPress={() => _this.gotoPresentation(dishID)}><Text style={{ color: '#fff' }}>Details</Text></Button>
                            </View>
                            <View style={{ flex: .5, flexDirection: 'row', alignItems: 'center' }} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
})
var alertFlag = 0;
let NoMoreCards = React.createClass({
    render() {
        let alertText = null;
        if (alertFlag === 1) {
            alertText = <Text style={{ color: '#777', width: devWidth * 0.82, textAlign: 'center', backgroundColor: 'transparent' }}>Oops, seems like there are no available dishes in your area. Want to change that? Start by uploading your own recommendations!</Text>
        } else {
            alertText = <Text style={{ color: '#777', width: devWidth * 0.82, textAlign: 'center', backgroundColor: 'transparent' }}>Sorry, there are no more dishes in your area. Want to change that? Start by uploading your own recommendations!</Text>
        }
        return (
            // <View style={{ flex: 1 }}>
            //     <View style={{ flex: 2.5 }} />
            //     <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }} >
            //         {alertText}
            //     </View>
            //     <View style={{ flex: .2 }} />
            // </View>
            <Text>t</Text>
        )
    }
})

export var globalHome = {};
var gpsTimer, watchID;
var isGPSFired;
class Home extends Component {

    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            cards: [],
            outOfCards: false,
            isLoading: false,
            dishLoaded: false,
            modalVisible: false,
            showVersion: false,
            gpsModalVisible: false
        };
        isGPSFired = false;
    }

    componentDidMount() {
        this.handleLocationProvider();
        this.loadCategoriesData();
        gpsTimer = setInterval(this.handleLocationProvider, 2000);
        globalHome.handle = this;
    }
    handleLocationProvider() {
        if (isGPSFired == false) {
            isGPSFired = true;
            if (Global.current_lat == 0 && Global.current_lng == 0) {
                _this.getCurrentCoordinate();
            } else {
                _this.loadDishData();
                // navigator.geolocation.clearWatch(watchID);
                clearInterval(gpsTimer);
            }
        }
    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(watchID);
        clearInterval(gpsTimer);
    }
    getCurrentCoordinate() {
        if (Platform.OS == 'ios' && Global.current_lat == 0) {
            _this.setState({ isLoading: true });
            watchID = navigator.geolocation.watchPosition(
                (position) => {
                    if (Math.round(Util.getDistanceFromLatLonInKm(Global.current_lat, Global.current_lng, position.coords.latitude, position.coords.longitude)) > 3) {
                        Global.current_lat = position.coords.latitude;
                        Global.current_lng = position.coords.longitude;
                        _this.loadDishData();
                    }
                },
                (error) => {
                    isGPSFired = false;
                    _this.setState({ isLoading: false });
                });
        } else if (Platform.OS == 'android' && Global.current_lat == 0) {
            LocationServicesDialogBox.checkLocationServicesIsEnabled({
                message: "<h6>Want to see gluten free dishes, shared by Celiacs abround you? Turn on your GPS.</h6> We need to know your location to present Celiac-friendly resturants in your area.",
                ok: "OK, cool!",
                cancel: "NO",
                showDialog: "true"
            }).then(function (success) {
                _this.setState({ isLoading: true });
                watchID = navigator.geolocation.watchPosition((position) => {
                    if (Math.round(Util.getDistanceFromLatLonInKm(Global.current_lat, Global.current_lng, position.coords.latitude, position.coords.longitude)) > 3) {
                        Global.current_lat = position.coords.latitude;
                        Global.current_lng = position.coords.longitude;
                        _this.loadDishData();
                    }
                },
                    (error) => {
                        //isGPSFired = false;
                        _this.showGPSOpenDialog();
                        _this.setState({ isLoading: false });
                    });
            }).catch((error) => {
                //isGPSFired = false;
                _this.showGPSOpenDialog();
                _this.setState({ isLoading: false });
            });
        }
        console.log("LoadDishData function working");
    }

    showGPSOpenDialog() {
        _this.setState({ gpsModalVisible: true });
    }

    openGpsSettingMenu() {

        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "",
            ok: "ok",
            cancel: "",
            showDialog: "false"
        }).then(function (success) {
            _this.setState({ gpsModalVisible: false });
            _this.setState({ isLoading: true });
            watchID = navigator.geolocation.watchPosition((position) => {
                if (Math.round(Util.getDistanceFromLatLonInKm(Global.current_lat, Global.current_lng, position.coords.latitude, position.coords.longitude)) > 3) {
                    Global.current_lat = position.coords.latitude;
                    Global.current_lng = position.coords.longitude;
                    _this.loadDishData();
                }
            },
                (error) => {
                    isGPSFired = false;
                    _this.setState({ isLoading: false });
                });

        }).catch((error) => {
            //isGPSFired = false;
            _this.setState({ isLoading: false });
        });
    }

    setGpsModelVisible() {
        _this.setState({ gpsModalVisible: false });
    }

    loadDishData() {
        this.setState({ isLoading: true });
        var formdata = new FormData();
        let api;
        if (Global.isGuest === true) {
            api = 'dish/all_guest';
            formdata.append('Latitude', Global.current_lat);
            formdata.append('Longitude', Global.current_lng);
        } else {
            api = 'dish/all_user';
            formdata.append('UserId', Global.user_id);
            formdata.append('Latitude', Global.current_lat);
            formdata.append('Longitude', Global.current_lng);
        }
        fetch(Global.SERVER_URL + api, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            method: "POST",
            body: formdata
        })
            .then((response) => response.json())
            .then((responseData) => {
                // navigator.geolocation.clearWatch(watchID);
                if (responseData.length === 0) {
                    alertFlag = 1;
                    this.setState({
                        isLoading: false,
                        dishLoaded: true
                    });
                } else {
                    this.handleResponse(responseData)
                }
            })
            .done();
    }

    loadCategoriesData() {
        console.log(Global.SERVER_URL + 'category/all');

        this.setState({
            isLoading: true,
        })
        fetch(Global.SERVER_URL + 'category/all', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: "GET"
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                Global.categoryList = responseData.categories;
                Global.categoriesEn = [];
                for (var i = 1; i < Global.categoryList.length; i++) {
                    Global.categoriesEn.push(Global.categoryList[i].Category_E);
                }

                this.setState({
                    isLoading: false,
                })

            })
            .done();
    }

    AddFavouriteDish(DishId, UserId) {
        if (Global.isGuest === true) {
            return;
        }
        var formdata = new FormData();
        formdata.append('DishId', DishId);
        formdata.append('UserId', UserId);
        if (DishId != 0 && UserId != 0) {
            fetch(Global.SERVER_URL + 'favourite/add', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                method: "POST",
                body: formdata
            })
                .then((responseData) => {
                })
                .done();
        } else {
            Alert.alert('Invalid info', 'Input all fields to upload your adventure');
        }
    }
    gotoFavourite() {
        if (Global.isGuest === true) {
            Alert.alert(
                '',
                'Sorry, you need to register in order to add a new dish!',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                    { text: 'Register', onPress: () => this.props.replaceRoute('signup') },
                ]
            );
        } else {
            Analytics.logEvent('favorite_button', null);
            this.navigateTo('favourite');
        }
    }
    handleResponse(responseData) {
        this.setState({
            isLoading: false,
            dishLoaded: true,
            cards: responseData,
        });
    }

    handleYup(card) {
        Analytics.logEvent('mark_swipe_right', null);
        _this.AddFavouriteDish(Global.dish_id, Global.user_id)
    }
    handleNope(card) {
        Analytics.logEvent('dismiss_swipe_left', null);
    }
    handleClicked(card) {
        var dishID = card.id;
        Global.dish_id = dishID;
        _this.gotoPresentation(dishID);
    }
    cardRemoved(index) {
        let CARD_REFRESH_LIMIT = 3
        if (_this.state.cards.length - index <= CARD_REFRESH_LIMIT + 1) {
        }
    }

    popRoute() {
        this.props.popRoute();
    }

    replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    navigateTo(route) {
        this.props.pushNewRoute(route);
    }
    gotoPresentation(dishID) {
        Global.dish_id = dishID;
        Global.location_state = 0;
        Analytics.logEvent('presentation_screen', null);
        this.navigateTo('presentation');
    }
    gotoCategories() {
        Analytics.logEvent('category_screen', null);
        this.navigateTo('categories');
    }
    gotoNope() {
        Analytics.logEvent('x_button_click', null);
        this._swipeCards._resetState();
    }
    gotoYup() {
        Analytics.logEvent('v_button_click', null);
        _this.AddFavouriteDish(Global.dish_id, Global.user_id)
        this._swipeCards._resetState();
    }

    logout() {
        navigator.geolocation.clearWatch(watchID);
        clearInterval(gpsTimer);
        FBLoginManager.logout(function (error, data) { });
        AsyncStorage.removeItem(TOKEN);
        AsyncStorage.removeItem(USER_ID);
        this.replaceRoute('login');
    }
    clickLogout() {
        if (Global.isGuest === true) {
            Global.isGuest = false;
            this.replaceRoute('login');
        } else {
            Alert.alert(
                '',
                'Are you sure that you want to log out?',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                    { text: 'OK', onPress: () => this.logout() },
                ]
            );
        }
    }
    gotoAddNewDish() {
        if (Global.isGuest === true) {
            Alert.alert(
                '',
                'Sorry, you need to register in order to add a new dish!',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                    { text: 'Register', onPress: () => this.props.replaceRoute('signup') },
                ]
            );
        } else {
            this.navigateTo('addnewdish');
        }
    }
    gotoSearch() {
        Alert.alert(
            '',
            'Search Option:',
            [
                { text: 'Change location', onPress: () => alert('Change location') },
                { text: 'Search restaurant', onPress: () => alert('Search Restaurnt') },
            ]
        )
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    render() {
        let noMoreCard;
        noMoreCard = this.state.dishLoaded == true ?
            (<NoMoreCards />)
            :
            (<View></View>);
        // TODO: add dynamic version to code (look under showIf)
        return (
            <Container theme={theme}>
                <Header style={{ backgroundColor: theme.brandPrimary, justifyContent: 'space-between', height: theme.headerHeight }}>
                    <Grid>
                        <Col style={[styles._alignCol, { flex: 5 }]}>
                            <Text
                                style={styles._titleText}
                                onLongPress={() => this.setState({ showVersion: !this.state.showVersion })}>CeliHack</Text>
                            {showIf(this.state.showVersion)(
                                <Text style={styles._titleVersion}>v3.2.2</Text>
                            )}
                        </Col>
                        <Col style={[styles._alignCol, { flex: 5 }]}>
                            <TouchableOpacity style={styles._alignCol}
                                onPress={() => this.setModalVisible(true)}>
                                <Image style={{ width: 25, height: 25, tintColor: 'white' }} source={require('../../../images/search_icon.png')} />
                                <Text style={{ color: '#FFF' }}>Search</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col style={[styles._alignCol, { flex: 5 }]}>
                            <TouchableOpacity style={styles._alignCol}
                                onPress={() => this.gotoAddNewDish()}>
                                <Image style={{ width: 25, height: 25 }} source={require('../../../images/plus_icon.png')} />
                                <Text style={{ color: '#FFF' }}>Add a new dish</Text>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </Header>
                <Content scrollEnabled={false} style={{ flex: 1, backgroundColor: '#ebebeb' }}>
                    <OverlaySpinner visible={this.state.isLoading} />
                    <Modal
                        transparent={true}
                        visible={this.state.modalVisible}
                        supportedOrientations={['portrait', 'landscape']}
                        onRequestClose={() => { alert("Modal has been closed.") }}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ width: devWidth * 0.7, height: devWidth * 0.3 }}>
                                <View style={{ flex: 1, borderRadius: 10, backgroundColor: '#fcfcff' }}>
                                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: 'grey' }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                            Search Options:
                                        </Text>
                                    </View>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: 'grey' }}
                                            onPress={() => {
                                                this.setModalVisible(!this.state.modalVisible);
                                                this.navigateTo('changeLocation');
                                            }}>
                                            <Text style={{ color: 'grey', fontSize: 15 }}>
                                                Change location
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => {
                                                Analytics.logEvent('search_restaurant', null);
                                                this.setModalVisible(!this.state.modalVisible);
                                                this.navigateTo('searchRestaurant');
                                            }}>
                                            <Text style={{ color: 'grey', fontSize: 15 }}>
                                                Restaurants
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ position: 'absolute', right: 0, top: 0, width: 50, height: 50 }}>
                                    <TouchableOpacity onPress={() => { this.setModalVisible(!this.state.modalVisible) }}>
                                        <Image style={{ width: 50, height: 50 }} source={require('../../../images/close_icon.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={[styles._alignCol, { flex: 1 }]}>
                        <Image style={{ width: devWidth * .95, height: devWidth * .95, marginTop: devWidth * .1 }} resizeMode={'stretch'} source={require('../../../images/cards.png')}>


                            <HideableView visible={this.state.gpsModalVisible}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                    supportedOrientations={['portrait', 'landscape']}
                                >
                                    <View style={{ width: devWidth * 0.8, height: devWidth * 0.8, marginTop: devHeight * 0.04}}>
                                        <View style={{ flex: 1, borderRadius: 1, backgroundColor: '#fcfcff' }}>
                                            <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0, borderColor: 'grey' }}>
                                                <Image style={{ width: devWidth * 0.7, height: devWidth * 0.7 }} source={require('../../../images/gpsPopup.png')} />
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                                <Button style={{ width: theme.devWidth * .2, height: null, marginBottom: 6, backgroundColor: "#ff944d" }} onPress={() => this.openGpsSettingMenu()}><Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>ok</Text></Button>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </HideableView>
                            <HideableView visible={!this.state.gpsModalVisible}>
                                <SwipeCards
                                    ref={(ref) => this._swipeCards = ref}
                                    cards={this.state.cards}
                                    loop={false}
                                    renderCard={(cardData) => <Card key={cardData.id} {...cardData} />}
                                    renderNoMoreCards={() => noMoreCard}
                                    showYup={true}
                                    showNope={true}
                                    handleYup={this.handleYup}
                                    handleNope={this.handleNope}
                                    handleClicked={this.handleClicked}
                                    cardRemoved={this.cardRemoved}
                                    containerStyle={styles.cardContainerStyle}
                                    style={{ height: 0, opacity: 0 }}
                                />
                            </HideableView>
                        </Image>

                        <View style={styles._cardNextPrevBtn}>
                            <TouchableOpacity onPress={ this.state.gpsModalVisible? false: this.gotoNope.bind(this) }>
                                <Image style={{ width: (Platform.OS === 'ios') ? 75 : 65, height: (Platform.OS === 'ios') ? 75 : 65 }} resizeMode='stretch' source={require('../../../images/no_icon.png')} />
                                <Text style={{ alignSelf: 'center' }}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ this.state.gpsModalVisible? false:this.gotoFavourite.bind(this)}>
                                <Image style={{ width: (Platform.OS === 'ios') ? 70 : 60, height: (Platform.OS === 'ios') ? 70 : 60 }} source={require('../../../images/favorite_icon.png')} resizeMode='stretch' />
                                <Text style={{ alignSelf: 'center' }}>Favorites</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ this.state.gpsModalVisible? false:this.gotoYup.bind(this)}>
                                <Image style={{ width: (Platform.OS === 'ios') ? 75 : 65, height: (Platform.OS === 'ios') ? 75 : 65 }} resizeMode='stretch' source={require('../../../images/yes_icon.png')} />
                                <Text style={{ alignSelf: 'center' }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </Content>
                <Footer style={{ flex: 1, backgroundColor: theme.brandPrimary }}>
                    <View style={styles._footer}>
                        <View style={{ flex: 2 }} />
                        <View style={[styles._alignCol, { flex: 10 }]}>
                            <TouchableOpacity style={[styles._alignCol, { flexDirection: 'row' }]} onPress={() => this.gotoCategories()}>
                                <Image style={{ width: 44, height: 30 }} resizeMode={'stretch'} source={require('../../../images/food_menu_icon.png')} />
                                <Text style={styles._allFoodCategory}>All Food Categories</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles._alignCol, { flex: 2 }]}>
                            <TouchableOpacity onPress={() => this.clickLogout()}>
                                <Image source={require('../../../images/user_profile.png')}
                                    style={{ width: 30, height: 30 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Footer>
            </Container>
        )
    }
}


function bindAction(dispatch) {
    return {
        replaceRoute: (route) => dispatch(replaceRoute(route)),
        pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    }
}

export default connect(null, bindAction)(Home);
