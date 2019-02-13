'use strict';

import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Alert, Linking} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { popRoute, pushNewRoute } from '../../actions/route';
import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem,} from 'native-base';
import { Grid, Col, Row } from "react-native-easy-grid";

import theme from '../../themes/base-theme';
import styles from './styles';
import Global from '../../Global';
import Util from '../../utils.js';

var noFlag = 1;

class SearchRestaurant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantList: [],
            isLoading: false,
        }
    }
    componentWillMount() {
        this.loadRestaurantData()
    }
    loadRestaurantData() {
        this.setState({
            isLoading: true,
        })
        var formdata = new FormData();
        formdata.append('Longitude', Global.current_lng);
        formdata.append('Latitude', Global.current_lat);
              
        fetch( Global.SERVER_URL + 'dish/search_restaurant', {
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
        }else {
            noFlag = 1;
        }
        this.setState({
            isLoading: false,
            restaurantList: responseData,
        });
    }
    popRoute() {
        this.props.popRoute();
    }

    navigateTo(route) {
        this.props.pushNewRoute(route);
    }
    gotoPresentation(RestaurantName, Address){
        this.props.navigator.push({
            id: 'searchRestaurantHome',
            passProps: {
                RestaurantName : RestaurantName,
                Address: Address,
            }
        });
    }
        
    render() {
        let Restaurants;
        if (this.state.restaurantList.length !== 0) {
            Restaurants = this.state.restaurantList.map((restaurant, i) => {
                let distance;
                if (Global.current_lat === 0) {
                    distance = 'calculating...'
                }else {
                    distance = ''+ Math.round(Util.getDistanceFromLatLonInKm( Global.current_lat, Global.current_lng, restaurant.Latitude, restaurant.Longitude))+'km away';
                }
                return (
                    <TouchableOpacity key ={i} onPress={()=>this.gotoPresentation( restaurant.RestaurantName, restaurant.Address )}>
                        <View  style={{ width:theme.deviceWidth, height:90, flexDirection:'row', margin:1, borderBottomWidth:1, borderColor: theme.customColor}}>
                            <View style={{flex:1}}>
                                <Image  style={{flex:1, width:null, height:null}} 
                                        source={{ uri: restaurant.Image }} 
                                        resizeMode={'stretch'}/>
                            </View>
                            <View style={{flex:2, flexDirection: 'column', justifyContent: 'space-between',}}>
                                <Text numberOfLines={1} style={{ color:'grey', fontWeight: 'bold', marginLeft: 10, marginTop: 3}}>
                                    { restaurant.RestaurantName }
                                </Text>
                                <Text numberOfLines={2} style={{color:theme.customColor, marginLeft: 10, }}>
                                    { restaurant.Address }
                                </Text>
                                <Text style={{marginLeft: 10, marginBottom:3,  color:'#74cdc1', textDecorationLine: 'underline'}}>
                                    { distance }
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })
        } else {
            Restaurants = ( 
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:'#000'}}>
                        {noFlag ===0 ? "There is not any restaurant at nearest" : ''}
                    </Text>
                </View>
            );
        }
        return (
            <Container theme={theme}>
                <Header style={{ backgroundColor:theme.brandPrimary, justifyContent: 'space-between', height: theme.headerHeight}}>
                    <Grid>
                        <Col style={{flex:2, alignItems:'center', justifyContent:'center'}}>
                            <Button transparent onPress={() => this.popRoute()}>
                                <Icon name='ios-arrow-back' style={styles.titleArrow} />
                            </Button>
                        </Col>
                        <Col style={{ flex: 5, justifyContent: 'center' }}>
                            <Text style={styles._titleText}>
                                Restaurants
                            </Text>
                        </Col>
                        <Col style={{ flex: 2 }}>
                        </Col>
                    </Grid>
                </Header>
                <Content style={{backgroundColor: 'transparent'}} >
                    { Restaurants }
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

export default connect(null, bindAction)(SearchRestaurant);
