'use strict';

import React, { Component } from 'react';
import { Platform , Text} from 'react-native';
import { Container, Header, View, Button, Icon} from 'native-base';
import { connect } from 'react-redux';

import { popRoute ,replaceOrPushRoute} from '../../actions/route';
import Global from '../../Global';
import theme from '../../themes/base-theme';
import styles from './styles';

var {GooglePlacesAutocomplete} = require('../../control/react-native-google-places-autocomplete/GooglePlacesAutocomplete');
var Analytics = require('react-native-firebase-analytics');

class ChangeLocation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Address: null,
            isSelected: false,
        }
    }

    gotoChangedLocationHome(locationName) {
        
        Global.changed_lat = this.state.Address.lat;
        Global.changed_lng = this.state.Address.lng;
        Analytics.logEvent('change_location', null);
        this.props.navigator.replace({
            id: 'changeLocationHome',
            passProps: {
                locationName : locationName,
            }
        });
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
            saveButton = <Button transparent onPress={() => this.gotoChangedLocationHome(this.state.Address.description)}>
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
                            Change Location
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
                            var selectAddress = {
                                                        description:    data.description,
                                                        lat:            details.geometry.location.lat, 
                                                        lng:            details.geometry.location.lng 
                                                };
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
                        currentLocation={false} 
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

export default connect(null, bindAction)(ChangeLocation);
