'use strict';

import React, { Component } from 'react';
import { Image, Platform, TouchableOpacity, AsyncStorage, Alert, StatusBar} from 'react-native';
import { connect } from 'react-redux';

import { pushNewRoute, replaceRoute, popRoute } from '../../actions/route';

import { Container, Content, Text, InputGroup, Input, Button, Icon, View, Radio } from 'native-base';
import { Grid, Col, Row } from "react-native-easy-grid";
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

import styles from './styles';
import theme from '../../themes/base-theme';
import { TOKEN, USER_ID, LANGUAGE } from '../../Constants';
import Global from '../../Global';
import Spinner from 'react-native-loading-spinner-overlay';
import UXCam from 'react-native-ux-cam';

var LoginBehavior = {
  'ios': FBLoginManager.LoginBehaviors.Browser,
  'android': FBLoginManager.LoginBehaviors.Native
}
var _this;
var Analytics = require('react-native-firebase-analytics');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : '',
            scroll : false,
            selected : true,
        };
        _this = this;
    }
    replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    pushNewRoute(route) {
         this.props.pushNewRoute(route);
    }
    popRoute() {
        this.props.popRoute();
    }
    onSelected(_selected){
       this.setState({ selected:_selected });
    }
    focusNextField(nextField) {
        this.refs[nextField]._textInput.focus();
    }
    guestLogin() {
        Global.isGuest = true;
        this.state.selected? AsyncStorage.setItem(LANGUAGE, 'En'): AsyncStorage.setItem(LANGUAGE, 'Hy');
        Analytics.logEvent('guest_login', null);
        // go to home
        this.state.selected? this.replaceRoute('home'): this.replaceRoute('home0');
    }

    login() {
        this.setState({ isLoading: true });
        fetch(Global.SERVER_URL + 'user/login', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                })
            }
        )
        .then((response) => response.json())
        .then((responseData) => {
            if( responseData.status_code > 400 ) {
                Alert.alert(
                    '',
                    responseData.message,
                    [
                        {text: 'OK', onPress: () => console.log('dd')},
                    ]
                ); 
                this.setState({ isLoading: false });
            }else {

                try {
                    Global.user_token = responseData.token;
                    Global.user_id = responseData.id;
                    Global.isGuest = false;
                    AsyncStorage.setItem(TOKEN, responseData.token);
                    AsyncStorage.setItem(USER_ID, ''+responseData.id);
                    this.state.selected? AsyncStorage.setItem(LANGUAGE, 'En'): AsyncStorage.setItem(LANGUAGE, 'Hy');
                    Analytics.setUserId(''+responseData.id);
                    Analytics.setUserProperty('propertyName', 'gmail');
                    this.setState({
                        isLoading: false,
                    });

                    // UXCam
                    // ---------
                    // Tag a user.
                    UXCam.tagUserName(''+Global.user_id);
                    let isLoggedInUser = true;

                    // Add a custom tag with properties.
                    UXCam.addTag('generalTag', {
                        isLoggedIn: isLoggedInUser.toString(),
                        language: this.state.selected ? 'En' : 'Hy',
                    });
                }
                catch(err) {
                    console.log('\n\n\nError:\n' + err.message + '\n\n\n');
                }

                this.state.selected? this.replaceRoute('home'): this.replaceRoute('home0');
            }
        })
        .catch((error) => {
            this.setState({
                isLoading: false,
            })
        })
        .done();
    }


    
    loginWithFacebook() {
      FBLoginManager.loginWithPermissions(["email","public_profile"], function(error, data){
        if (data == null) {
            return;
        }
        if (!error) {
            _this.setState({ isLoading: true });
            fetch(Global.SERVER_URL + 'user/fblogin', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fbtoken: data.credentials.token
                })
            })
            .then((response) => response.json())
            .then((responseData) => {
                if( responseData.status_code > 400 ) {
                    _this.setState({ isLoading: false });
                    Alert.alert(
                        '',
                        'The email address you have entered is already registered. Did you signed in before using Facebook connect? If so, please click on the Facebook connect button.',
                        [
                            {text: 'OK', onPress: () => console.log('dd')},
                        ]
                    ); 
                } else {
                    Global.user_id = responseData.id;
                    AsyncStorage.setItem(USER_ID, ''+responseData.id);
                    Analytics.setUserId(''+responseData.id);
                    Analytics.setUserProperty('propertyName', 'facebook');
                    _this.state.selected? AsyncStorage.setItem(LANGUAGE, 'En'): AsyncStorage.setItem(LANGUAGE, 'Hy');
                    _this.setState({ isLoading: false });
                    _this.state.selected? _this.replaceRoute('home'): _this.replaceRoute('home0');
                }
            })
            .done();
        } else {
            console.log(error);
        }
      });
    }

    componentDidMount() {
        this.setState({email: this.props.defaultEmail});
    }
    render() {
        let english, hebrew;
        english = this.state.selected ?
          (<Image source={require('../../../images/english.png')} style={{width:30, height:20, marginRight:10}} resizeMode={'stretch'} />)
          :
          (<Image source={require('../../../images/english1.png')} style={{width:30, height:20, marginRight:10}} resizeMode={'stretch'} />);
        hebrew = this.state.selected ?
          (<Image source={require('../../../images/hebrew1.png')} style={{width:30, height:20}}  resizeMode={'stretch'} />)
          :
          (<Image source={require('../../../images/hebrew.png')} style={{width:30, height:20}}  resizeMode={'stretch'} />);

        return (
            <Grid style={{backgroundColor: theme.brandPrimary}}>
               
                <Spinner visible={this.state.isLoading} />
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <View />
                    <Button rounded transparent  block large 
                            style={styles.guestBtn} 
                            textStyle={Platform.OS === 'android' ? {alignSelf: 'center', fontSize: 14,fontWeight: 'bold', color: '#fff'} : {marginTop: -12,fontSize: 14,fontWeight: 'bold', color: '#fff'}}
                            onPress={() => this.guestLogin()}>
                        Guest
                    </Button>
                </View>
                <Row style={{flex:2, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../../../images/logo.png')} style={styles.shadow} />
                </Row>
                <Row style={{flex:3, alignItems:'center', justifyContent:'center'}}>
                    <View style={styles.inputContainer}>
                        <View style={{marginBottom: 8}}>
                            <InputGroup>
                                <Icon name='ios-person' style={{color:"#FFF"}} />
                                <Input
                                    ref="1" 
                                    placeholder="E-Mail"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    placeholderTextColor='#eee'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => this.focusNextField('2')}
                                    onChangeText={(email) => this.setState({email})}
                                    value={this.state.email}
                                    style={{color:'#FFF'}}
                                />
                            </InputGroup>
                        </View>

                        <View style={{marginBottom: 2}}>
                            <InputGroup >
                                <Icon name='ios-unlock-outline' style={{color:"#FFF"}}/>
                                <Input
                                    ref="2" 
                                    placeholder='Password'
                                    placeholderTextColor='#eee'
                                    secureTextEntry={true}
                                    returnKeyType='done'
                                    onChangeText={(password) => this.setState({password})}
                                    style={{color:'#FFF'}}
                                />
                            </InputGroup>
                            <View style={{flex:1,flexDirection:'row', justifyContent:'flex-end'}}>
                                <TouchableOpacity onPress={() => this.replaceRoute('forgotpw')} style={{}}><Text style={{color:'#fff', fontSize:12}}>Forgot Password?</Text></TouchableOpacity>
                            </View>
                            
                        </View>
                       
                        <Button style={styles.login} onPress={()=>this.login()}>
                            Login
                        </Button>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 25}}>
                            <Button onPress={() => this.loginWithFacebook()}
                                    style={[styles.logoButton, {backgroundColor: '#3541A9'}]}>
                                <Icon name='logo-facebook' />
                            </Button>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                          <Text style={{color:'#ebebeb', marginRight:20}}>Select language</Text>
                          <TouchableOpacity onPress={() => this.onSelected(true)}>
                            {english}
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.onSelected(false)}>
                            {hebrew}
                          </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color:'#FFF', marginTop:(Platform.OS==='ios') ? 0 : 5}}>Do not have an account? </Text>
                            <Button transparent
                                    style={styles.transparentButton}
                                    textStyle={{color:'#FFF', lineHeight: (Platform.OS==='ios') ? 15 : 24, textDecorationLine: 'underline'}}
                                    onPress={() => this.props.replaceRoute('signup')}>
                                    Sign up here
                            </Button>
                        </View>
                    </View>
                </Row>
            </Grid>
        )
    }
}

function bindActions(dispatch){
    return {

        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route)),
        popRoute:()=>dispatch(popRoute())
    }
}

export default connect(null, bindActions)(Login);
