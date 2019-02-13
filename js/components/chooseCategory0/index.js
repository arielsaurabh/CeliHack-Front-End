'use strict';

import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Header, Footer, View, Button, Icon, Card, CardItem } from 'native-base';
import MultipleChoice from 'react-native-multiple-choice'
import { popRoute ,replaceOrPushRoute} from '../../actions/route';

import theme from '../../themes/base-theme';
import styles from './styles';
import {globalAddNewDish} from '../addnewdish0/index.js';
import Global from '../../Global';

let selectedOption = [];
let categoryIds = "";

class ChooseCategory0 extends Component {

    constructor(props) {
        super(props);
        selectedOption=[];
        categoryIds = '';
    }
    okButtonClick() {
        categoryIds = "";
        for(var i=0; i < Global.categoriesHb.length; i++){
            for(var j=0; j < selectedOption.length; j++){
            if( Global.categoriesHb[i] === selectedOption[j])
                categoryIds = categoryIds + (i + 1)+ ","
            }
        }
        globalAddNewDish.addNewDish.changeCategoryID(selectedOption.toString(), categoryIds);
        this.popRoute();
    }
    popRoute() {
        this.props.popRoute();
    }
    navigateTo(route) {
        this.props.replaceOrPushRoute(route);
    }
    addSelectedCategory(option) {
        for(var i=0; i < 20;i++){
            if(option === selectedOption[i]){
                selectedOption.splice(i, 1);
                return;
            }
        }
        selectedOption.push(option);
        if(selectedOption.length === 21)
            selectedOption.splice(0, 1);
    }
    showSelected(){
      categoryIds = "";
      for(var i=0; i < Global.categoriesHb.length; i++){
        for(var j=0; j < selectedOption.length; j++){
          if( Global.categoriesHb[i] === selectedOption[j])
            categoryIds = categoryIds + (i + 1)+ ","
        }
      }
    }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: theme.defaultBackgroundColor}}>
                <Header style={{ height: theme.headerHeight, justifyContent: 'flex-start', paddingTop: (Platform.OS==='ios') ? 23 : 9}}>
                    <Button transparent onPress={() => this.popRoute()}>
                        <Icon name='ios-arrow-back' style={styles.titleArrow} />
                        בחר קטגוריות
                    </Button>
                </Header>
                <Content style={{backgroundColor: 'transparent', padding:10}} >
                    <Card style={{padding:10}}>
                        <MultipleChoice
                           options={Global.categoriesHb}
                           maxSelectedOptions={20}
                           selectedOptions={[]}
                           onSelection={(option)=>this.addSelectedCategory(option)}
                        />
                    </Card>
                </Content>
                <Footer style={{marginTop:5}}>
                    <View style={{flex:1}}>
                        <Button block style={{width:300}} textStyle={{color:'#FFF'}} onPress={() => this.okButtonClick()}>Save</Button>
                    </View>
                </Footer>
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

export default connect(null, bindAction)(ChooseCategory0);
