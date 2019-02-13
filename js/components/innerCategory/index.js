'use strict';

import React, { Component }from 'react';
import { Platform, View, Text, TouchableOpacity, Image, Dimensions, Alert , Linking} from 'react-native';
import { connect } from 'react-redux';
import { popRoute , replaceRoute, replaceOrPushRoute, pushNewRoute} from '../../actions/route';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { Container, Header, Footer, Content, Button, Icon, Spinner} from 'native-base';
import { Grid, Col, Row } from "react-native-easy-grid";
import SwipeCards from '../swipecards';

import theme from '../../themes/base-theme';
import styles from './style';
import Global from '../../Global';
import Util from '../../utils.js';

var devWidth = Dimensions.get('window').width;
var devHeight = Dimensions.get('window').height;
var _this;

let Card = React.createClass({
  render() {
    var dishID = this.props.id;
    Global.dish_id = dishID;
    var restaurantLat = this.props.Latitude;
    var restaurantLng = this.props.Longitude;
    let distance;
    if (Global.current_lat === 0) {
        distance = 'calculating...'
    }else {
        distance = ''+ Math.round(Util.getDistanceFromLatLonInKm(Global.current_lat,Global.current_lng,restaurantLat,restaurantLng))+' km away';
    }
    return (
        <TouchableOpacity onPress={() => _this.gotoPresentation(dishID)}>
            <View style={styles.card}>
                <View style={styles.thumbnail}>
                    <Image style={styles._cardMainImage} resizeMode={'stretch'} source={{uri: this.props.Image}}>
                        <Image style={styles._cardSubImage} resizeMode={'stretch'} source={require('../../../images/transparent_bar.png')}>
                            <View style={styles._cardSubImageView3}>
                                <Image style={{marginLeft:10, width:devWidth * .07, height:devWidth * .07}}
                                        resizeMode={'stretch'}
                                        source={require('../../../images/comment_icon.png')}/>
                                <Text style={styles._cardSubTextReview}>{this.props.FavouriteCount}</Text>
                            </View>
                        </Image>
                    </Image>
                </View>
                <View>
                    <View style={styles._cardDishNameView}>
                        <View style={{flex:1,flexDirection:'row', justifyContent:'flex-start'}}>
                            <Text numberOfLines={1}  style={{flex:7, marginLeft:5,}}>{this.props.DishName}</Text>
                            <Text numberOfLines={1}  style={{flex:3, marginRight:5, textAlign:'right',color:'#74cdc1',textDecorationLine:'underline'}}>{distance}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row', alignItems:'center'}}>
                            <Icon name='ios-pin' style={styles._cardDishNameIcon}/>
                            <Text numberOfLines={1} style={{ width: devWidth * .75, marginLeft:5, fontSize:15, marginBottom:2}}>{this.props.RestaurantName}</Text>
                        </View>
                        <View style={{flex:.5,flexDirection:'row', alignItems:'center'}} />
                        <View style={[styles._alignCol, {flex:1, flexDirection:'row'}]}>
                            <Button rounded style={{width:theme.devWidth*.2, height:null}} onPress={() => _this.gotoPresentation(dishID)}><Text style={{color:'#fff'}}>Details</Text></Button>
                        </View>
                        <View style={{flex:.5,flexDirection:'row', alignItems:'center'}} />
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
       alertText = <Text style={{color:'#777', width: devWidth*0.82, textAlign:'center', backgroundColor: 'transparent'}}>Oops, seems like there are no available dishes in your area. Want to change that? Start by uploading your own recommendations!</Text>
    } else {
       alertText = <Text style={{color:'#777', width: devWidth*0.82, textAlign:'center', backgroundColor: 'transparent'}}>Sorry, there are no more dishes in your area. Want to change that? Start by uploading your own recommendations!</Text>
    }
    return (
        <View style={{flex: 1}}>
            <View style={{flex:2.5}} />
            <View style={{flex:1, flexDirection:'column', justifyContent:'flex-end'}} >
                {alertText}
            </View>
            <View style={{flex:.2}} />
        </View>
    )
  }
})

class InnerCategory extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            cards: [],
            outOfCards: false,
            isLoading: false,
            dishLoaded: false,
        }
    }
    componentWillMount() {
        this.loadDishData()
    }
    loadDishData() {
        this.setState({
            isLoading: true,
        })
        var formdata = new FormData();
        formdata.append('CategoryId', (this.props.categoryID));
        formdata.append('Latitude', Global.current_lat);
        formdata.append('Longitude', Global.current_lng);
        fetch( Global.SERVER_URL + 'dish_category', {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            },
            method: "POST",
            body: formdata
        })
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.length === 0 ) {
                alertFlag = 1;
                this.setState({
                    isLoading: false,
                    dishLoaded: true,
                });
            }else {
                this.handleResponse(responseData)
            }
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
        if(DishId!= 0 && UserId != 0){
            fetch(Global.SERVER_URL + 'favourite/add', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                method: "POST",
                body: formdata
            })
            .then((responseData) => {
                // Alert.alert('Adding succeed','This Dish has been added successfully');
                
            })
            .done();
        } else {
            Alert.alert('Invalid info','Input all fields to upload your adventure');
        }
    }
    gotoFavourite() {
        if (Global.isGuest === true) {
            Alert.alert(
                '',
                'Sorry, you need to register in order to add a new dish!',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                    {text: 'Register', onPress: () => this.props.replaceRoute('signup')},
                ]
            );  
        } else {
            this.navigateTo('favourite');
        }
    }
    handleResponse(responseData) {
        this.setState({
            isLoading:false,
            dishLoaded: true,
            cards: responseData,
        });
    }
    componentDidMount() {
        _this = this;
    }
    handleYup (card) {
        _this.AddFavouriteDish( Global.dish_id, Global.user_id);
    }
    handleNope (card) {
    }
    handleClicked(card) {
        var dishID = card.id;
        Global.dish_id = dishID;
        _this.gotoPresentation(dishID);
    }
    cardRemoved (index) {
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
        this.navigateTo('presentation');
    }
    gotoNope() {
        this._swipeCards._resetState();
    }
    gotoYup() {
        _this.AddFavouriteDish( Global.dish_id, Global.user_id)
        this._swipeCards._resetState();
    }
    
    gotoAddNewDish() {
        if (Global.isGuest === true) {
            Alert.alert(
                '',
                'Sorry, you need to register in order to add a new dish!',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                    {text: 'Register', onPress: () => _this.props.replaceRoute('signup')},
                ]
            );  
        } else {
            this.navigateTo('addnewdish');
        }
    }
    render() {
        let noMoreCard;
        noMoreCard = this.state.dishLoaded == true ? 
            (<NoMoreCards />)
        :
            (<View></View>)
        return (
            <Container theme={theme}>
                <Header style={{ backgroundColor:theme.brandPrimary, justifyContent: 'space-between', height: theme.headerHeight}}>
                    <Grid>
                        <Col style={styles.noMoreCards}>
                            <Button transparent onPress={() => this.props.popRoute()}>
                                <Icon name='ios-arrow-back' style={styles.titleArrow} />
                            </Button>
                        </Col>
                        <Col style={[styles._alignCol, {flex:8}]}>
                            <Text style={styles._titleText}>{this.props.categoryData.Category_E}</Text>
                        </Col>
                        <Col style={{flex:1}}>
                        </Col>
                    </Grid>
                </Header>
                <Content scrollEnabled={false} style={{flex:1,backgroundColor:'#ebebeb'}}>
                <OverlaySpinner visible={this.state.isLoading} />
                    <View style={[styles._alignCol, {flex:1}]}>
                        <Image style={{width:devWidth * .95, height:devWidth * .95, marginTop: devWidth * .1}} resizeMode={'stretch'} source={require('../../../images/cards.png')}>
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
                            />
                        </Image>
                        <View style={styles._cardNextPrevBtn}>
                          <TouchableOpacity onPress={this.gotoNope.bind(this)}>
                            <Image style={{width:(Platform.OS==='ios') ? 75 : 65, height:(Platform.OS==='ios') ? 75 : 65}} resizeMode='stretch' source={require('../../../images/no_icon.png')}/>
                            <Text style={{alignSelf:'center'}}>Skip</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={this.gotoFavourite.bind(this)}>
                            <Image style={{width:(Platform.OS==='ios') ? 70 : 60, height:(Platform.OS==='ios') ? 70 : 60}} source={require('../../../images/favorite_icon.png')} resizeMode='stretch' />
                            <Text style={{alignSelf:'center'}}>Favorites</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={this.gotoYup.bind(this)}>
                            <Image style={{width:(Platform.OS==='ios') ? 75 : 65, height:(Platform.OS==='ios') ? 75 : 65}} resizeMode='stretch' source={require('../../../images/yes_icon.png')}/>
                            <Text style={{alignSelf:'center'}}>Save</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                </Content>
                <Footer style={{flex:1, backgroundColor:theme.brandPrimary}}>
                    <View style={styles._footer}>
                        <TouchableOpacity style={{flexDirection:'row'}} onPress={() => this.gotoAddNewDish()} >
                            <Image source={require('../../../images/plus_icon.png')} />
                            <Text style={styles._newDish}>Add a new Dish</Text>
                        </TouchableOpacity>
                    </View>
                </Footer>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        pushNewRoute:(route)=>dispatch(pushNewRoute(route)),
        popRoute:() => dispatch(popRoute()),
        replaceRoute:(route)=>dispatch(replaceRoute(route))
    }
}

export default connect(null, bindAction)(InnerCategory);
