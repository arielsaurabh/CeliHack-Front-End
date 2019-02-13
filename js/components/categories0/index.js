'use strict';

import React, { Component } from 'react';
import { Image, TouchableOpacity, Alert} from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Content, Text, Button, Icon} from 'native-base';
import { Grid, Col, Row } from "react-native-easy-grid";
import SudokuGrid from 'react-native-smart-sudoku-grid';

import theme from '../../themes/base-theme';
import styles from './style';
import { popRoute, replaceRoute, pushNewRoute } from '../../actions/route';
import Global from '../../Global';
var Analytics = require('react-native-firebase-analytics');

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: Global.categoryList,
        }
    }
    popRoute() {
        this.props.popRoute();
    }
    navigateTo(route) {
        this.props.pushNewRoute(route);
    }
    gotoInnerCategory(categoryID, categoryData) {
        Analytics.logEvent('specify_category', null);
        this.props.navigator.push({
            id: 'innerCategory0',
            passProps: {
                categoryID : categoryID,
                categoryData: categoryData,
            }
        });
    }
    _renderGridCell = (data, index, list) => {
        return (
          <TouchableOpacity underlayColor={'#eee'} onPress={ this._onPressCell.bind(this, data, index) }>
              <Image source={{uri: data.Image}} style={styles.categoryImage}>
                  <Image source={require('../../../images/category_o.png')} style={styles.categoryView}>
                     <Text style={styles.categoryText}>{data.Category_H}</Text>
                  </Image>
              </Image>
          </TouchableOpacity>
        )
    }
    _onPressCell (data, index) {
        this.gotoInnerCategory(index, data);
    }
    gotoAddNewDish() {
        if (Global.isGuest === true) {
            Alert.alert(
                '',
                'Sorry, you need to register in order to add a new dish!',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                    {text: 'Register', onPress: () => this.props.replaceRoute('signup')},
                ]
            );  
        }else {
            this.navigateTo('addnewdish0');
        }
    }
    render() {
        return (
            <Container theme={theme}>
                <Header style={{ height: theme.headerHeight, backgroundColor:theme.brandPrimary, justifyContent: 'space-between'}}>
                    <Grid>
                        <Col style={[styles.colAlign, {flex:1}]}>
                            <Button transparent onPress={() => this.popRoute()}>
                                <Icon name='ios-arrow-back' style={styles.titleArrow} />
                            </Button>
                        </Col>
                        <Col style={{flex:1}}></Col>
                        <Col style={[styles.colAlign, {flex:6}]}>
                            <Text style={styles.titleText}>כל קטגוריות האוכל</Text>
                        </Col>
                        <Col style={{flex:3}}>
                            <TouchableOpacity style={styles.colAlign}
                                onPress={() => this.gotoAddNewDish()}>
                                <Image style={{width:25, height:25}} resizeMode={'stretch'} source={require('../../../images/plus_icon.png')} />
                                <Text style={{fontSize:12, color:'#FFF'}}>הוסף מנה חדשה</Text>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </Header>
                <Content style={{backgroundColor: 'transparent'}}>
                    <SudokuGrid
                        containerStyle={{ backgroundColor: '#fff',}}
                        columnCount={2}
                        dataSource={this.state.dataList}
                        renderCell={this._renderGridCell}
                    />
                </Content>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: () => dispatch(popRoute()),
        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route))
    }
}

export default connect(null, bindAction)(Category);
