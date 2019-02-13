
'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Keyboard, Image, Platform, Dimensions, TouchableOpacity, TextInput,  AsyncStorage, Alert} from 'react-native';
import {Container, Content, Text, Button, Icon, InputGroup, Input, View } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import {popRoute, replaceRoute} from '../../actions/route';
import theme from '../../themes/base-theme';
import styles from './styles';

import { TOKEN, USER_ID } from '../../Constants';
import Global from '../../Global';

var Analytics = require('react-native-firebase-analytics');


class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            visibleHeight: Dimensions.get('window').height,
            offset: {
                x:0,
                y:0
            },
            isLoading: false,
        };
        this.constructor.childContextTypes = {
            theme: React.PropTypes.object,
        }
    }

    componentWillMount () {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
    }

    keyboardWillShow (e) {
       /*let newSize = Dimensions.get('window').height - e.endCoordinates.height
       this.setState({offset :{y: 80}});*/
    }

    keyboardWillHide (e) {
        //this.setState({offset :{y: 0}});
    }

    popRoute() {
        this.props.popRoute();
    }
    replaceRoute(route) {
        this.props.replaceRoute(route);
    }
    clickGuestButton() {
        Global.guest = true;
        this.replaceRoute('home');
    }
    focusNextField(nextField) {
        this.refs[nextField]._textInput.focus();
    }
    signup() {
        this.setState({
            isLoading: true,
        })
        fetch(Global.SERVER_URL + 'user/signup', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.username,
            })
        })
        .then((response) => response.json())
        .then((responseData) => {
            if( responseData.status_code === 422 ) {
                var errors = responseData.errors;
                var message = '\n';
                for (var i = 0; i < errors.length; i ++) {
                    message = message + errors[i][0] + '\n';
                }
                Alert.alert(
                    '',
                    message,
                    [
                        {text: 'OK', onPress: () => console.log('dd')},
                    ]
                );
                this.setState({
                    isLoading: false
                })
            }else {
                this.setState({
                    isLoading: false,
                });
                Analytics.logEvent('registration', null);
                this.props.navigator.replace({
                    id: 'login',
                    passProps: {
                        defaultEmail: this.state.email
                    }
                });
            }
        })
        .catch((error) => {
            this.setState({
                isLoading: false,
            })
        })
        .done();
    }
    render() {
        return (
            <Container>
                <Content style={{flex:1, backgroundColor:theme.brandPrimary}}
                         contentOffset={this.state.offset} scrollEnabled={false}>

                    <View theme={theme}>
                            <Spinner visible={this.state.isLoading} />    
                            
                            <Text style={Platform.OS === 'android' ? styles.asignupHeader : styles.signupHeader}>Create an Account</Text>
                            <View style={Platform.OS === 'android' ? styles.asignupContainer : styles.signupContainer}>
                                <InputGroup borderType="rounded" style={Platform.OS === 'android' ? styles.inputGrp : styles.iosInputGrp}>
                                    <Icon name="ios-person-outline" />
                                    <Input  ref="1" 
                                            placeholder="Username"
                                            autoCapitalize="none"
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => this.focusNextField('2')}
                                            returnKeyType='next'
                                            onChangeText={(username) => this.setState({username})}
                                            style={styles.input}/>
                                </InputGroup>

                                <InputGroup borderType="rounded" style={Platform.OS === 'android' ? styles.inputGrp : styles.iosInputGrp}>
                                    <Icon name="ios-mail-open-outline" />
                                    <Input  ref="2"
                                            placeholder="Email"  
                                            keyboardType='email-address'
                                            autoCapitalize="none"
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => this.focusNextField('3')}
                                            returnKeyType='next'
                                            onChangeText={(email) => this.setState({email})}
                                            style={styles.input}/>
                                </InputGroup>

                                <InputGroup borderType="rounded" style={Platform.OS === 'android' ? styles.inputGrp : styles.iosInputGrp}>
                                    <Icon name="ios-unlock-outline" />
                                    <Input  ref="3"
                                            placeholder="Password"
                                            returnKeyType ='done' 
                                            onChangeText={(password) => this.setState({password})}
                                            secureTextEntry={true}  
                                            style={styles.input}/>
                                </InputGroup>

                                <Button rounded transparent  block large style={styles.signupBtn} textStyle={Platform.OS === 'android' ? {alignSelf: 'center',marginTop: 7,fontSize: 14,fontWeight: 'bold'} : {marginTop: -12,fontSize: 14,fontWeight: 'bold'}}   onPress={() => this.signup()}>
                                    Sign Up
                                </Button>
                                <Button rounded transparent  block large style={styles.signupBtn} textStyle={Platform.OS === 'android' ? {alignSelf: 'center',marginTop: 7,fontSize: 14,fontWeight: 'bold'} : {marginTop: -12,fontSize: 14,fontWeight: 'bold'}}   onPress={() => this.props.replaceRoute('login')}>
                                    Back to Login
                                </Button>
                            </View>
                    </View>
                </Content>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: () => dispatch(popRoute()),
        replaceRoute:(route)=>dispatch(replaceRoute(route))
    }
}

export default connect(null, bindAction)(SignUp);
