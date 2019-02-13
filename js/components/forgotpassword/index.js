'use strict';

import React, { Component } from 'react';
import { Image, Platform, TouchableOpacity, AsyncStorage, Alert, Text, Dimensions} from 'react-native';
import { connect } from 'react-redux';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Content,  InputGroup, Input, Button, Icon, View, Radio } from 'native-base';
import { Grid, Col, Row } from "react-native-easy-grid";

import styles from './styles';
import theme from '../../themes/base-theme';
import { TOKEN, USER_ID, LANGUAGE } from '../../Constants';
import Global from '../../Global';
import Spinner from 'react-native-loading-spinner-overlay';

var devWidth = Dimensions.get('window').width - 50;

class ForgotPassword extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: '',
        };
    }
    replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    pushNewRoute(route) {
         this.props.pushNewRoute(route);
    }
    
    forgotPassword() {
        this.setState({
            isLoading: true
        })
        fetch(Global.SERVER_URL + 'user/recovery', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
            })
        })
        .then((response) => response.json())
        .then((responseData) => {
            if( responseData.state_code === 200 ) {
                Alert.alert(
                    '',
                    'Password reset email has been sent. Please check your inbox',
                    [
                        {text: 'OK', onPress: () => this.replaceRoute('login')},
                    ]
                ); 
                this.setState({
                    isLoading: false
                })
            } else  {
                Alert.alert(
                    '',
                    responseData.message,
                    [
                        {text: 'OK', onPress: () => console.log('dd')},
                    ]
                ); 
                this.setState({
                    isLoading: false,
                });
            }
        })
        .done();
    }
    
    render() {
        return (
            <Grid style={{backgroundColor: theme.brandPrimary}}>
                <Spinner visible={this.state.isLoading} />
                <Row style={{flex:1.5, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../../../images/logo.png')} style={styles.shadow} />
                </Row>
                <Row style={{flex:3, alignItems:'center', justifyContent:'center'}}>
                    <View style={styles.inputContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color:'#FFF', fontSize:25, marginTop:(Platform.OS==='ios') ? 0 : 5}}>Problems signing in? </Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                            <Text style={{ marginLeft:20, marginRight:20, color:'#FFF', width:devWidth, textAlign:'center', fontSize:15, marginTop:(Platform.OS==='ios') ? 0 : 5}}>Enter the email you registered with CeliHack and we'll send instructions to get you back on your feet.</Text>
                        </View>
                        <View style={{margin: 20}}>
                            <InputGroup>
                                <Icon name='ios-person' style={{color:"#FFF"}} />
                                <Input
                                    placeholder="E-Mail"
                                    keyboardType="email-address"
                                    placeholderTextColor='#eee'
                                    onChangeText={(email) => this.setState({email})}
                                    style={{color:'#FFF'}}
                                />
                            </InputGroup>
                        </View>
                        <Button style={styles.login} onPress={()=>this.forgotPassword()}>
                            Confirm
                        </Button>
                        <Button style={styles.login} onPress={()=>this.replaceRoute('login')}>
                            Back
                        </Button>
                        <View style={{flex:4}} />
                    </View>
                </Row>
            </Grid>
        )
    }
}

function bindActions(dispatch){
    return {
        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route))
    }
}

export default connect(null, bindActions)(ForgotPassword);
