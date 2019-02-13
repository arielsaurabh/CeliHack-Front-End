'use strict';

import React, { Component } from 'react';
import { Image, ScrollView, Platform , TouchableOpacity, TouchableHighlight, Text, StyleSheet} from 'react-native';
import { connect } from 'react-redux';

import { popRoute ,replaceOrPushRoute} from '../../actions/route';

import { Container, Content, Header, Footer, View, Button, Icon, Card, CardItem } from 'native-base';
import MultipleChoice from 'react-native-multiple-choice'
import theme from '../../themes/base-theme';
import styles from './styles';
import {globalAddNewDish} from '../addnewdish0/index.js';
import Autocomplete from 'react-native-autocomplete-input';
import Global from '../../Global';
var AddressSel ='';
var LatitudeSel = 0;
var LongitudeSel = 0;
class ChooseRestaurant0 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Restaurants: [],
            RestaurantName: '',
        }
    }
    componentWillMount() {
        this.loadRestaurantData()
    }
    loadRestaurantData() {
        this.setState({
            isLoading: true,
        })
        fetch( Global.SERVER_URL + 'dish_restaurant', {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            method: "GET"
        })
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.length === 0 ) {
                this.setState({
                    isLoading: false,
                });
            }else {
                this.handleResponse(responseData)
            }
        })
        .done();        
    }
    handleResponse(responseData) {
        this.setState({
            isLoading: false,
            Restaurants: responseData.dishes,
        });
    }
    okButtonClick() {
        if (AddressSel === '') {
            globalAddNewDish.addNewDish.changeRestaurantName(this.state.RestaurantName);
        } else {
            globalAddNewDish.addNewDish.changeRestaurantNameAndAddress(this.state.RestaurantName, AddressSel, LatitudeSel, LongitudeSel);
        }
        this.popRoute();
    }
    popRoute() {
        this.props.popRoute();
    }
    navigateTo(route) {
        this.props.replaceOrPushRoute(route);
    }
    
    _filterData(query) {
        if (query === '') {
            return [];
        }
        const { Restaurants } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return Restaurants.filter((Restaurant) => Restaurant.RestaurantName.search(regex) >= 0);
    }
     _renderData(Restaurants) {
        if (Restaurants.length > 0) {
            return (
                <View style={styles.info}>
                    <Text style={styles.titleText}>{Restaurants[0].RestaurantName}</Text>
                    <Text style={styles.directorText}>{Restaurants[0].Address}</Text>
                </View>
            );
        }
        AddressSel ='';
        LatitudeSel = 0;
        LongitudeSel = 0;
        return (
            <View style={styles.info}>
                <Text style={styles.infoText}></Text>
            </View>
        );
    }
    
    render() {
        const { RestaurantName } = this.state;
        const Restaurants = this._filterData(RestaurantName);
        const comp = (s, s2) => s.toLowerCase().trim() === s2.toLowerCase().trim();
        return (
            <Container theme={theme} style={{backgroundColor: theme.defaultBackgroundColor}}>
                <Header style={{ height: theme.headerHeight, paddingTop: (Platform.OS==='ios') ? 23 : 9}}>
                    <View style = {{flex:1, flexDirection:'row',justifyContent: 'space-between', }}>
                        <Button transparent onPress={() => this.popRoute()}>
                            <Icon name='ios-arrow-back' style={styles.titleArrow} />
                            Choose Restaurant
                        </Button>
                        <Button transparent onPress={() => this.okButtonClick()}>
                            OK
                        </Button>
                    </View>
                </Header>
                <View style={{flex:1, backgroundColor: 'transparent', padding:10, margin: 10}} >
                    {this._renderData(Restaurants)}
                    <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={styles.autocompleteContainer}
                        data={Restaurants.length === 1 && comp(RestaurantName, Restaurants[0].RestaurantName) ? [] : Restaurants}
                        defaultValue={RestaurantName}
                        onChangeText={text => this.setState({ RestaurantName: text })}
                        placeholder="הכנס שם מסעדה"
                        renderItem={({ RestaurantName, Address, Latitude, Longitude, id }) => (
                            <TouchableOpacity onPress={() =>{
                                                                AddressSel = Address;
                                                                LatitudeSel = Latitude;
                                                                LongitudeSel = Longitude; 
                                                                this.setState({ RestaurantName: RestaurantName })
                                                            }}>
                              <View style={{flex:1, flexDirection: 'column', borderWidth: 1, borderColor: '#aaa'}}>
                                <Text style={styles.itemText}>
                                    {RestaurantName}
                                </Text>
                                <Text style={styles.itemTextAddress}>
                                    {Address}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                    />
                </View>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: () => dispatch(popRoute()),
        replaceOrPushRoute:(route)=>dispatch(replaceOrPushRoute(route))
    }
}

export default connect(null, bindAction)(ChooseRestaurant0);
