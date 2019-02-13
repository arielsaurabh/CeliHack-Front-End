'use strict';

import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Alert, Linking} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { popRoute, replaceOrPushRoute, pushNewRoute } from '../../actions/route';
import { Container, Header, Content, Text, Button, Icon, Card, CardItem,} from 'native-base';
import { Grid, Col, Row } from "react-native-easy-grid";
import theme from '../../themes/base-theme';
import styles from './styles';
import Global from '../../Global';
import Util from '../../utils.js';
import {globalHome} from '../home0/index.js';
var noFlag = 1;
class Favourite0 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favourites: [],
            isLoading: false
        }
    }
    componentWillMount() {
        this.loadDishData()
    }
    loadDishData() {
        this.setState({ isLoading: true });
        var formdata = new FormData();
        formdata.append('UserId', Global.user_id)
        formdata.append('Longitude', Global.current_lng);
        formdata.append('Latitude', Global.current_lat);
              
        fetch( Global.SERVER_URL + 'favourite/get', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            method: "POST",
            body: formdata
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.handleResponse(responseData);
        })
        .done();        
    }
    handleResponse(responseData) {
        if (responseData.length === 0) {
            noFlag = 0;
        } else {
            noFlag = 1;
        }
        this.setState({
            favourites: responseData,
            isLoading: false
        });
    }
    popRoute() {
        if (Global.isReload === true) {
            Global.isReload = false;
            globalHome.handle.loadDishData();
        }
        this.props.popRoute();
    }

    navigateTo(route) {
        this.props.pushNewRoute(route);
    }
    gotoPresentation(dishId){
        Global.dish_id = dishId;
        this.navigateTo('presentation0');
    }
    delOk(dishId){
        this.deletFromFavourite(dishId);
    }
    delCancel(){
    }
    deletFromFavourite(dishId) {
        this.setState({
            isLoading: true,
        });
        Global.isReload = true;
        fetch( Global.SERVER_URL + 'favourite_del/' + Global.user_id +'/'+ dishId, {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            method: "GET"
        })
        .then((responseData) => {
            this.loadDishData();
        })
        .done();        
    }
    
    render() {
        let Favourites;
        if (this.state.favourites.length !== 0) {
            Favourites = this.state.favourites.map((favourite, i) => {
                let distance;
                if (Global.current_lat === 0) {
                    distance = 'calculating...'
                }else {
                    distance = ''+ Math.round( Util.getDistanceFromLatLonInKm(Global.current_lat,Global.current_lng,favourite.Latitude,favourite.Longitude))+'km away';
                }
                return (
                    <TouchableOpacity key ={i} onPress={()=>this.gotoPresentation(favourite.id)}>
                    <View  style={{ width:theme.deviceWidth, height:131, flexDirection:'row', margin:3, borderBottomWidth:1, borderColor: theme.customColor}}>
                        
                        <View style={{flex:3}}>
                            <View style={{flex:3, flexDirection:'row'}}>
                                <View style={{flex:0.7}}>
                                    <TouchableOpacity transparent style = {{flex:1, padding:5}} 
                                            onPress={()=>Alert.alert(
                                                                    '',
                                                                    'Are you sure you want to delete this dish from your favorites?',
                                                                    [
                                                                        {text: 'Cancel', onPress: () =>this.delCancel()},
                                                                        {text: 'OK', onPress: () => this.delOk(favourite.id)},
                                                                    ]
                                                                )}>
                                        <Image style={{width:30, height:40, tintColor:theme.brandPrimary}} source={require('../../../images/garbage.png')} resizeMode={'stretch'}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:3}}>
                                    <View style={{flex:1}}>
                                        <Text numberOfLines={1} style={{marginRight:5, color:theme.customColor, flex:1, textAlign:'right'}}>{favourite.DishName}</Text>
                                    </View>
                                    <View style={{flex:2}}>
                                        <View style={{flex:1, flexDirection:'row'}}>
                                            
                                            <View style={{flex:5}}>
                                                <View style={{flex:1}}>
                                                    <Text numberOfLines={1} style={{textAlign:'right', color:theme.customColor}}>
                                                        {favourite.RestaurantName}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{flex:1}}>
                                                <Image style={{width:20, height:20, tintColor:theme.brandPrimary}} source={require('../../../images/location-pointer.png')} resizeMode={'stretch'}/>
                                            </View>
                                        </View>
                                        <View style={{flex:1}}>
                                            <Text style={{marginRight: 10, textAlign:'right', color:'#74cdc1', textDecorationLine: 'underline'}}>{distance}</Text>
                                        </View>
                                    </View>
                                </View>
                                
                            </View>
                            <View style={{flex:2, flexDirection:'row'}}>
                                
                                <View style={{flex:2, flexDirection:'row'}}>
                                    <View style={{flex:4}}>
                                        <View style={{flex:1,flexDirection:'row'}}>
                                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                                <Image style={{flex:1, height:25, width:35}} resizeMode={'stretch'} source={require('../../../images/emoji1.png')}/>
                                            </View>
                                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                                <Image style={{flex:1, height:25, width:25}} resizeMode={'stretch'} source={require('../../../images/emoji2.png')}/>
                                            </View>
                                        </View>
                                        <View style={{flex:1,flexDirection:'row'}}>
                                            <View style={{flex:1}}>
                                                <Text style={{color:theme.customColor,textAlign:'center'}}>{favourite.SideEffectGood}</Text>
                                            </View>
                                            <View style={{flex:1}}>
                                                <Text style={{color:theme.customColor, textAlign:'center'}}>{favourite.SideEffectBad}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex:2}}>
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        
                                        <View style={{flex:3}}>
                                            <View style={{flex:1}}>
                                                <Text style={{textAlign:'right', marginRight:5, color:theme.customColor}}>{favourite.SideEffectBad + favourite.SideEffectGood}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:1}}>
                                            <Image style={{width:20, height:20, tintColor:theme.brandPrimary}} source={require('../../../images/chat.png')} resizeMode={'stretch'}/>
                                        </View>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text style={{marginRight:10, color:theme.customColor, textAlign:'right'}}>תופעות לוואי</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:2}}>
                            <Image style={{flex:1, width:null, height:null}} source={{uri:favourite.Image}} resizeMode={'stretch'}/>
                        </View>
                    </View>
                    </TouchableOpacity>
                )
            })
        } else {
            Favourites = <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text style={{color:'#000'}}>{ noFlag ===0 ? "You don't have any favorite dishes" : ''}</Text></View>
        }
        return (
            <Container theme={theme}>
                <Header style={{ backgroundColor:theme.brandPrimary, justifyContent: 'space-between', height: theme.headerHeight}}>
                    <Grid>
                        <Col style={{flex:5, alignItems:'center', justifyContent:'center'}}>
                            <Button transparent onPress={() => this.popRoute()}>
                                <Icon name='ios-arrow-back' style={styles.titleArrow} />
                            </Button>
                        </Col>
                        <Col style={{flex:5, alignItems: 'center', justifyContent:'center'}}><Text style={styles._titleText}>מועדפים</Text></Col>
                        <Col style={[styles._alignCol, {flex:5}]}>
                            <TouchableOpacity style={styles._alignCol}
                                onPress={() => this.navigateTo('addnewdish0')}>
                                <Image style={{width:24, height:24}} resizeMode='stretch' source={require('../../../images/plus_icon.png')} />
                                <Text style={{color:'#FFF'}}>הוסף מנה חדשה</Text>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </Header>
                <Content padder style={{backgroundColor: 'transparent'}} >
                    <Spinner visible={this.state.isLoading} />
                  {Favourites}
                </Content>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: () => dispatch(popRoute()),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route))
    }
}

export default connect(null, bindAction)(Favourite0);
