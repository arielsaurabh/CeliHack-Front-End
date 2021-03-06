'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Platform, Dimensions, TouchableOpacity, Image, TextInput, Modal, Text, Linking, Alert } from 'react-native';
import { Container, Header, Content, Footer, Icon, InputGroup, Input, } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { Grid, Col, Row } from "react-native-easy-grid";
import Toast from 'react-native-simple-toast';
import { popRoute, pushNewRoute, replaceRoute } from '../../actions/route';
import { globalHome } from '../home/index.js';
import theme from '../../themes/base-theme';
import styles from './styles';
import Global from '../../Global';
import Util from '../../utils.js';

import Share, { ShareSheet, Button } from 'react-native-share';

var reviewList = [
    { ReviewOwner: '', Review: '', created_at: '' },
    { ReviewOwner: '', Review: '', created_at: '' }
];

export var globalPresentation = {};
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var Analytics = require('react-native-firebase-analytics');

class Presentation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dish: [],
            review: null,
            isLoading: false,
            visible: false,
            modalVisible: false,
            message: '',
        };
        reviewList = [
            { ReviewOwner: '', Review: '', created_at: '' },
            { ReviewOwner: '', Review: '', created_at: '' }
        ];
    }
    componentWillMount() {
        this.loadDishData();
        globalPresentation.handle = this;

    }
    loadDishData() {
        this.setState({
            isLoading: true,
        })
        fetch(Global.SERVER_URL + 'dish/' + Global.dish_id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: "GET"
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.length === 0) {
                    this.setState({
                        isLoading: false,
                    });
                } else {
                    if (responseData.status_code !== 500) {
                        this.handleDetailResponse(responseData);
                    }
                    else
                        this.setState({ isLoading: false });
                }
            })
            .done();
    }
    handleDetailResponse(responseData) {
        this.setState({
            isLoading: false,
            dish: responseData.dish,
            review: responseData.dish.review
        });
    }
    navigateTo(route) {
        this.props.pushNewRoute(route);
    }
    gotoWriteReview() {
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
            this.props.navigator.push({
                id: 'review',
                passProps: {
                    effectCount: this.state.dish.SideEffectGood + this.state.dish.SideEffectBad,
                }
            });
        }

    }

    popRoute() {
        if (Global.isReload === true) {
            Global.isReload = false;
            globalHome.handle.loadDishData();
        }
        this.props.popRoute();
    }
    gotoViewReviewAll() {
        Analytics.logEvent('reviews_screen', null);
        this.navigateTo('viewMoreReview');
    }
    gotoFavorite() {
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
            this.navigateTo('favourite');
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
    onCancel() {
        this.setState({ visible: false });
    }
    onOpen() {
        this.setState({ visible: true });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    sendEmail() {
        var formdata = new FormData();
        formdata.append('DishId', Global.dish_id);
        formdata.append('UserId', Global.user_id);
        formdata.append('MailContent', this.state.message);

        fetch(Global.SERVER_URL + 'report/add', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            method: "POST",
            body: formdata
        })
        this.setState({ message: '' });
        Toast.show('Thank you!', Toast.SHORT);
    }
    render() {
        if (this.state.review != null) {
            if (this.state.review.length == 0) {
                reviewList[0].ReviewOwner = '';
                reviewList[0].Review = '';
                reviewList[0].created_at = '';
                reviewList[1].ReviewOwner = '';
                reviewList[1].Review = '';
                reviewList[1].created_at = ''
            } else if (this.state.review.length == 1) {
                reviewList[0] = this.state.review[0];
                reviewList[1].ReviewOwner = '';
                reviewList[1].Review = '';
                reviewList[1].created_at = '';
            } else {
                reviewList = this.state.review
            }
        }
        let distance;
        if (Global.location_state === 0) {
            distance = '' + Math.round(Util.getDistanceFromLatLonInKm(Global.current_lat, Global.current_lng, this.state.dish.Latitude, this.state.dish.Longitude)) + ' km away';
        } else {
            distance = '' + Math.round(Util.getDistanceFromLatLonInKm(Global.changed_lat, Global.changed_lng, this.state.dish.Latitude, this.state.dish.Longitude)) + ' km away';
        }
        let UserAndDateOne;
        if (reviewList[0].ReviewOwner === '') {
            UserAndDateOne = '';
        } else {
            var date = reviewList[0].created_at.split(' ', 1);
            UserAndDateOne = '(' + reviewList[0].ReviewOwner + ', ' + date + ')';
        }
        let UserAndDateTwo;
        if (reviewList[1].ReviewOwner === '') {
            UserAndDateTwo = '';
        } else {
            var date = reviewList[1].created_at.split(' ', 1);
            UserAndDateTwo = '(' + reviewList[1].ReviewOwner + ', ' + date + ')';
        }

        let sendButton;
        if (this.state.message.length != 0) {
            sendButton = (<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: 'grey' }}
                onPress={() => {
                    Analytics.logEvent('user_report', null);
                    this.setModalVisible(!this.state.modalVisible);
                    this.sendEmail();
                }}>
                <Text style={{ fontSize: 15 }}>
                    Send
                                </Text>
            </TouchableOpacity>);
        } else {
            sendButton = (<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: 'grey' }}>
                <Text style={{ color: 'grey', fontSize: 15 }}>
                    Send
                                </Text>
            </TouchableOpacity>);
        }

        return (
            <Container theme={theme} style={{ backgroundColor: '#ffffff' }}>
                <Header style={{ justifyContent: 'flex-start', paddingTop: (Platform.OS === 'ios') ? 23 : 9, height: theme.headerHeight }}>
                    <Grid>
                        <Col style={styles._col1}>
                            <TouchableOpacity transparent onPress={() => this.popRoute()}>
                                <Icon name='ios-arrow-back' style={styles.titleArrow} />
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles._col2}>
                            <TouchableOpacity style={styles._align} onPress={() => this.navigateTo('categories')}>
                                <Image style={styles._toolbarImage} resizeMode={'stretch'} source={require('../../../images/food_menu_icon.png')} />
                                <Text style={styles._toolbarText}>Food Categories</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles._col2}>
                            <TouchableOpacity style={styles._align} onPress={() => this.gotoFavorite()}>
                                <Image style={styles._toolbarImage} resizeMode={'stretch'} source={require('../../../images/ratings.png')} />
                                <Text style={styles._toolbarText}>Favorites</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles._col2}>
                            <TouchableOpacity style={styles._align} onPress={() => this.gotoAddNewDish()}>
                                <Image style={styles._toolbarImage} resizeMode={'stretch'} source={require('../../../images/plus_icon.png')} />
                                <Text style={styles._toolbarText}>Add a new dish</Text>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </Header>
                <Content>
                    <Spinner visible={this.state.isLoading} />
                    <Grid style={{ padding: 5 }}>
                        <Image style={styles._mainImage} resizeMode={'stretch'} source={{ uri: this.state.dish.Image }}>
                            <View style={{ flex: 4, height: theme.width * 0.6 }}>
                            </View>
                            <Image style={styles._mainTransImage} source={require('../../../images/transparent_bar.png')}>
                                <Text numberOfLines={1} style={{ fontSize: 20, color: '#fff', marginLeft: 15, marginRight: 15 }}>{this.state.dish.DishName}</Text>
                            </Image>
                        </Image>
                        <Row style={{ flex: 1, padding: 5, marginTop: 10 }}>
                            <Col style={{ flex: 1, marginLeft: 10, }}>
                                <Icon name='ios-pin' style={{ fontSize: 30, color: '#74cdc1' }} />
                            </Col>
                            <Col style={{ flex: 7 }}>
                                <Text numberOfLines={1} style={{ color: theme.customColor }}>{this.state.dish.RestaurantName}</Text>
                            </Col>
                            <Col style={{ flex: 4 }}>
                                <TouchableOpacity onPress={() => this.onOpen()}>
                                    <Text numberOfLines={1} style={{ color: theme.iconColor }}>{distance}</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        <Row style={{ flex: 1, marginTop: 5 }}>
                            <Col style={{ flex: 1 }}>
                            </Col>
                            <Col style={{ flex: 10, marginLeft: 5 }}>
                                <Text numberOfLines={1} style={{ color: theme.customColor }}>{this.state.dish.Address}</Text>
                            </Col>
                        </Row>
                        <Row style={styles._rowPrice}>
                            <Col style={{ flex: 1 }}>
                                <Image style={styles._priceImage} resizeMode={'stretch'} source={require('../../../images/price.png')} />
                            </Col>
                            <Col style={{ flex: 14 }}>
                                <Text style={{ marginLeft: 10, color: theme.customColor }}>{this.state.dish.Price}</Text>
                            </Col>

                        </Row>
                        <Row style={{ flex: 1, padding: 5 }}>
                            <Col style={{ flex: 1 }} />
                            <Col style={{ flex: 5 }}>
                                <Text style={{ color: theme.customColor }}>Celiac side effects</Text>
                            </Col>
                            <Col style={{ flex: 2 }}>
                                <Image style={styles._emojiImage1} source={require('../../../images/emoji1.png')} />
                            </Col>
                            <Col style={{ flex: 2 }}>
                                <Image style={styles._emojiImage2} source={require('../../../images/emoji2.png')} />
                            </Col>
                            <Col style={{ flex: 1 }} />
                        </Row>
                        <Row style={{ flex: 1, padding: 5 }}>
                            <Col style={{ flex: 1 }} />
                            <Col style={{ flex: 5 }} />
                            <Col style={{ flex: 2 }}>
                                <Text style={{ color: theme.customColor, marginLeft: 15 }}>{this.state.dish.SideEffectGood}</Text>
                            </Col>
                            <Col style={{ flex: 2 }}>
                                <Text style={{ color: theme.customColor, marginLeft: 10 }}>{this.state.dish.SideEffectBad}</Text>
                            </Col>
                            <Col style={{ flex: 1 }} />
                        </Row>
                        <Row style={styles._rowUser}>
                            <Col style={{ flex: 1 }}>
                                <Image style={styles._userProfile} resizeMode={'stretch'} source={require('../../../images/user.png')} />
                            </Col>
                            <Col style={{ flex: 12 }}>
                                <Text style={{ marginLeft: 10, color: theme.customColor }}>{this.state.dish.Anonymous === 1 ? 'Anonymous' : this.state.dish.UserName}</Text>
                            </Col>
                        </Row>
                        <Row style={styles._rowReview}>
                            <Col style={{ flex: 1 }}>
                                <Icon name='ios-chatbubbles' style={{ fontSize: 23 }} />
                            </Col>
                            <Col style={{ flex: 6 }} />
                            <Col style={{ flex: 5 }}>
                                <TouchableOpacity onPress={() => this.gotoWriteReview()}><Text style={styles._textReview1} > + Add a Review</Text></TouchableOpacity>
                            </Col>
                        </Row>
                        <View style={{ flexDirection: 'column', marginTop: 10, marginLeft: 10, marginRight: 10, justifyContent: 'center' }}>
                            <Text style={{ color: theme.customColor }}>{reviewList[0].Review}</Text>
                            <Text style={{ color: theme.customColor, }}>{UserAndDateOne}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', marginTop: 10, marginLeft: 10, marginRight: 10, justifyContent: 'center' }}>
                            <Text style={{ color: theme.customColor }}>{reviewList[1].Review}</Text>
                            <Text style={{ color: theme.customColor }}>{UserAndDateTwo}</Text>
                        </View>
                        <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                            <Button iconSrc={require('../../../images/waze.png')}
                                onPress={() => {
                                    Analytics.logEvent('using_waze', null);
                                    this.onCancel();
                                    setTimeout(() => {
                                        const Url = 'waze://?ll=' + this.state.dish.Latitude + ',' + this.state.dish.Longitude + '&navigate=yes';
                                        Linking.openURL(Url).catch(err =>
                                            Alert.alert(
                                                '',
                                                'You have to install Waze app!',
                                                [
                                                    { text: 'OK', onPress: () => console.log('Cancel Pressed!') },
                                                ]
                                            ));
                                    }, 300);
                                }}>
                                Waze
                            </Button>
                            <Button iconSrc={require('../../../images/map.png')}
                                onPress={() => {
                                    Analytics.logEvent('using_map', null);
                                    this.onCancel();
                                    setTimeout(() => {
                                        if (Platform.OS === 'android') {
                                            const newUrl = 'http://maps.google.com?saddr=' + Global.current_lat + ',' + Global.current_lng + '&daddr=' + this.state.dish.Latitude + ',' + this.state.dish.Longitude;
                                            Linking.openURL(newUrl);
                                        } else {
                                            const newUrl = 'https://maps.apple.com?saddr=' + Global.current_lat + ',' + Global.current_lng + '&daddr=' + this.state.dish.Latitude + ',' + this.state.dish.Longitude;
                                            Linking.openURL(newUrl);
                                        }

                                    }, 300);
                                }}>
                                Maps
                        </Button>
                        </ShareSheet>
                        <Modal
                            animationType={"slide"}
                            transparent={true}
                            visible={this.state.modalVisible}
                            supportedOrientations={['portrait', 'landscape']}
                            onRequestClose={() => { alert("Modal has been closed.") }}
                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <View style={{ width: theme.devWidth * 0.7, height: theme.devWidth * 0.5 }}>
                                    <View style={{ flex: 1, borderRadius: 10, backgroundColor: '#fcfcff' }}>
                                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15, marginTop: 5, fontWeight: 'bold' }}>
                                                Report Inappropriate Content
                                            </Text>
                                            <Text style={{ fontSize: 13, marginTop: 10, color: 'grey' }}>
                                                What's the problem?
                                            </Text>
                                        </View>
                                        <View style={{ flex: 2, padding: 10, }}>
                                            <InputGroup borderType='regular' >
                                                <Input multiline={true}
                                                    numberOfLines={4}
                                                    blurOnSubmit={(Platform.OS === 'ios') ? true : false}
                                                    style={{ marginTop: 5, justifyContent: 'center', alignItems: 'center' }}

                                                    placeholderTextColor={theme.customColor}
                                                    placeholder='Free Text Input'
                                                    onChangeText={(message) => this.setState({ message })} />
                                            </InputGroup>
                                        </View>
                                        <View style={{ flex: 1.5, flexDirection: 'row' }}>
                                            {sendButton}
                                            <TouchableOpacity
                                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                                onPress={() => {
                                                    this.setModalVisible(!this.state.modalVisible);
                                                }}>
                                                <Text style={{ fontSize: 15 }}>
                                                    Cancel
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

                    </Grid>

                </Content>
                <Footer style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: deviceWidth }}>
                        <TouchableOpacity style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setModalVisible(true)}>
                            <Icon name='ios-flag' style={{ fontSize: 23, color: 'grey' }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.gotoViewReviewAll()}
                            style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: theme.iconColor }} >All reviews</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 20, height: 20, marginRight: 15, tintColor: theme.customColor }} resizeMode={'stretch'} source={require('../../../images/eye.png')} />
                            <Text style={{ color: theme.customColor }}>{this.state.dish.ViewCount}</Text>
                        </View>
                    </View>
                </Footer>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: () => dispatch(popRoute()),
        pushNewRoute: (route) => dispatch(pushNewRoute(route)),
        replaceRoute: (route) => dispatch(replaceRoute(route))
    }
}

export default connect(null, bindAction)(Presentation);
