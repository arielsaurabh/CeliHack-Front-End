'use strict';

import React, { Component } from 'react';
import { Platform , Text} from 'react-native';
import { Container, Header, View, Button, Icon} from 'native-base';
import { connect } from 'react-redux';

import { popRoute ,replaceOrPushRoute} from '../../actions/route';
import {globalAddNewDish} from '../addnewdish/index.js';
import Global from '../../Global';
import theme from '../../themes/base-theme';
import styles from './styles';

var {GooglePlacesAutocomplete} = require('../../control/react-native-google-places-autocomplete/GooglePlacesAutocomplete');

class ChooseAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Address: null,
            isSelected: false,
        }
    }
    
    okButtonClick() {
        if (this.state.Address !== null ) {
            globalAddNewDish.addNewDish.changeAddress(this.state.Address.description, this.state.Address.geometry.location.lat, this.state.Address.geometry.location.lng);
        } else {
            globalAddNewDish.addNewDish.changeAddress(this._googlePlace.state.text, Global.current_lat, Global.current_lng);
        }
        this.popRoute();
    }
    popRoute() {
        this.props.popRoute();
    }
    navigateTo(route) {
        this.props.replaceOrPushRoute(route);
    }

    render() {
        let saveButton;
        if (this.state.isSelected === true) {
            saveButton = <Button transparent onPress={() => this.okButtonClick()}>
                            OK
                        </Button>; 
        } else {
            saveButton = <View></View>;
        }
        return (
            <Container theme={theme} style={{backgroundColor: theme.defaultBackgroundColor}}>
                <Header style={{ height: theme.headerHeight, paddingTop: (Platform.OS==='ios') ? 23 : 9}}>
                    <View style = {{flex:1, flexDirection:'row',justifyContent: 'space-between', }}>
                        <Button transparent onPress={() => this.popRoute()}>
                            <Icon name='ios-arrow-back' style={styles.titleArrow} />
                            Choose Address
                        </Button>
                        {saveButton}
                    </View>
                </Header>
                <View style={{backgroundColor: 'transparent', padding:10, margin: 10}} >
                    <GooglePlacesAutocomplete
                        ref={(ref) => this._googlePlace = ref}
                        placeholder='Search'
                        minLength={1} 
                        autoFocus={false}
                        isFocusText={(flag) =>this.setState({
                            isSelected: !flag,
                        })}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            var selectAddress = {description: data.description, geometry: { location: { lat: details.geometry.location.lat, lng: details.geometry.location.lng } }};
                            this.setState({
                                Address: selectAddress,
                                isSelected: true,
                            })
                        }}
                        getDefaultValue={() => {
                            return '';
                        }}
                        query={{
                            key: 'AIzaSyCarBVhApvDXc7Tz2Wh2SC2oFdrMoLZ7gE',
                            language: 'en',
                            types: [ 'establishment', 'address'],
                        }}
                        styles={{
                            description: {
                                fontWeight: 'bold',
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb',
                            },
                        }}
                        currentLocation={true} 
                        currentLocationLabel="Current location" 
                        nearbyPlacesAPI='GooglePlacesSearch'
                        GoogleReverseGeocodingQuery={{
                        }}
                        latitude={ Global.current_lat}
                        longitude={ Global.current_lng}
                        GooglePlacesSearchQuery={{
                        }}
                        enablePoweredByContainer = {true}
                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
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

export default connect(null, bindAction)(ChooseAddress);
