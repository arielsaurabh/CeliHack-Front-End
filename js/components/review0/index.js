'use strict';

import React, { Component } from 'react';
import { View, Platform, Image, TouchableOpacity, Alert} from 'react-native';
import { connect } from 'react-redux';

import { popRoute, replaceOrPushRoute } from '../../actions/route';

import { Container, Header, Content, Title, Text, Button, Icon, Card, CardItem, InputGroup, Input } from 'native-base';
import Toast from 'react-native-simple-toast';
import { Grid, Col, Row } from "react-native-easy-grid";
import CheckBox from 'react-native-custom-checkbox';
import theme from '../../themes/base-theme';
import styles from './styles';

import Global from '../../Global';
import {globalPresentation} from '../presentation0/index.js';

var Analytics = require('react-native-firebase-analytics');

class Review0 extends Component {
    constructor(props){
      super(props);
      this.state={
        checked:true,
        selected:true,
        // state variable for reviews
        DishId: 0,
        Review: '',
      };
    }
    popRoute() {
        this.props.popRoute();
    }

    navigateTo(route) {
        this.props.replaceOrPushRoute(route);
    }
    onChecked(_checked){
        this.setState({
          checked: !_checked
        });
    }
    onSelected(_selected){
       this.setState({
         selected:_selected
       });
    }
    gotoBackButton() {
        if (this.state.Review != '') {
            Alert.alert(
                            '',
                            'Discard Review?',
                            [
                                {text: 'Cancel', onPress: () =>this.discardCancel()},
                                {text: 'OK', onPress: () => this.discardOk()},
                            ]
                        )
        } else {
            this.props.popRoute();
        }
    }
    discardCancel() {
    }
    discardOk() {
        this.props.popRoute();
    }
    AddReviewData() {
        var formdata = new FormData();
        if(this.state.Review != ''){
            formdata.append('DishId',     Global.dish_id);
            if (this.state.checked === true ) 
                formdata.append('UserId',       Global.user_id);
            else 
                formdata.append('UserId',       -1 );
            formdata.append('Review',   this.state.Review);
            if (this.state.selected === true ) {
                formdata.append('Effect', 1);
            } else {
                formdata.append('Effect', 0);
            }
            
            fetch(Global.SERVER_URL + 'social/add', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                method: "POST",
                body: formdata
            })
            .then((responseData) => {
                Toast.show('Your review has been added successfully', Toast.SHORT);
                Analytics.logEvent('add_new_review', null);
                globalPresentation.handle.loadDishData();
                this.props.popRoute();
            })
            .done();
        } else {
            Alert.alert('Invalid info','Input all fields to upload your adventure');
        }
    }

    render() {
        let emoji_like1,emoji_like2;
        emoji_like1 = this.state.selected ?
          (<Image style={styles._emoji1} resizeMode={'stretch'} source={require('../../../images/emoji1.png')}/>)
         :
          (<Image style={styles._emoji1} resizeMode={'stretch'} source={require('../../../images/emoji_1.png')}/>);
        emoji_like2 = this.state.selected ?
            (<Image style={styles._emoji2} resizeMode={'stretch'} source={require('../../../images/emoji_2.png')}/>)
           :
            (<Image style={styles._emoji2} resizeMode={'stretch'} source={require('../../../images/emoji2.png')}/>);
        return (
            <Container theme={theme} style={{backgroundColor: theme.defaultBackgroundColor}}>
                <Header style={{justifyContent: 'flex-start', paddingTop: (Platform.OS==='ios') ? 23 : 9, height: theme.headerHeight}}>
                    <Grid>
                        <Col style={{flex:1}}>
                            <Button transparent onPress={() => this.gotoBackButton()}>
                                <Icon name='ios-arrow-back' style={styles.titleArrow} />
                            </Button>
                        </Col>
                        <Col style={{flex:8, justifyContent:'center', alignItems:'center'}}>
                            <Text style={styles._titleText}>כל התגובות</Text>
                        </Col>
                        <Col style={{flex:1}}>
                        </Col>
                    </Grid>
                    
                </Header>
                <Content padder >

                    <View style={{flex: 1}}>
                        <Card foregroundColor={theme.inverseTextColor} transparent style={styles._col}>
                            <CardItem>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
                                    <Text style={styles._allReview}>
                                        {this.props.effectCount}: כל התגובות
                                    </Text>
                                    <Icon name='ios-chatbubbles' style={{color:theme.iconColor}}/>
                                </View>
                                <View style={styles._view1}>
                                    <TouchableOpacity onPress={() => this.onSelected(false)}>
                                      {emoji_like2}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.onSelected(true)}>
                                      {emoji_like1}
                                    </TouchableOpacity>
                                    <Text style={{color:theme.customColor}}>תופעות לוואי</Text>
                                </View>
                                <View style={styles._view2}>
                                    <Input
                                          multiline = {true}
                                          blurOnSubmit={(Platform.OS==='ios') ? true: false}
                                          style={{ flex:1,textAlign: "right"}}
                                          onChangeText={(Review) => this.setState({Review})}
                                          placeholderTextColor={theme.customColor} placeholder='כתוב תגובה'/>
                                </View>
                                <View style={styles._view3}>
                                     <Text style={{color:theme.customColor, marginLeft:10}}>הצג את שם המשתמש שלי</Text>
                                     <CheckBox
                                       style={{backgroundColor: '#f2f2f2', color:'#74cdc1', borderRadius: 5, borderWidth: 2}}
                                       checked={this.state.checked}
                                       onChange={(checked) => this.onChecked(this.state.checked)}
                                     />
                                </View>
                            </CardItem>
                        </Card>
                        <Button primary block textStyle={{color: theme.textColor}} onPress={() => this.AddReviewData()}>שמור</Button>
                    </View>
                </Content>
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

export default connect(null, bindAction)(Review0);
