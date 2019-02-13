'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Platform ,Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { popRoute, replaceOrPushRoute } from '../../actions/route';

import { Container, Header, Content, Title, Text, Button, Icon, Card, CardItem } from 'native-base';
import { Grid, Col, Row } from "react-native-easy-grid";
import theme from '../../themes/base-theme';
import styles from './styles';
import Global from '../../Global';

class ViewMoreReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: [],
            isLoading: false,
        }
    }
    componentWillMount() {
        this.loadDishReview();
    }
    loadDishReview() {
        this.setState({
            isLoading: true,
        })
        fetch( Global.SERVER_URL + 'social/' + Global.dish_id, {
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
                this.handleReviewResponse(responseData)
            }
        })
        .done();        
    }
    handleReviewResponse(responseData) {
        this.setState({
            reviews: responseData,
            isLoading: false,
        });
    }
    popRoute() {
        this.props.popRoute();
    }
    navigateTo(route) {
        this.props.replaceOrPushRoute(route);
    }
    render() {
        let Review;
        if (this.state.reviews.length != 0) {
            Review = this.state.reviews.map((review, i) => {
                return (
                    <View key={i} style={{marginBottom: 5}}>
                        <CardItem style={{flex:1}}>
                            <View style={{flexDirection:'row'}}>
                                <Image style={{width:23, height:23}} resizeMode={'stretch'} source={review.Effect===0?require('../../../images/emoji2.png'): require('../../../images/emoji1.png')}/>
                                <Text style={{color: theme.brandPrimary, marginLeft:10}}>
                                    {review.UserName}
                                </Text>
                            </View>
                            <Text style={{fontSize: 12, color:'#AAA', marginLeft:30}}>
                                {review.Review}
                            </Text>
                        </CardItem>
                    </View>
                )
            })
        } else {
            Review = <Card style={{marginBottom: 5}} transparent >
                        <CardItem>
                            <Text style={{fontSize: 12, color:'#AAA', marginLeft:30}}>
                                nothing
                            </Text>
                        </CardItem>
                    </Card>
        }
        return (
            <Container theme={theme} style={{backgroundColor: theme.defaultBackgroundColor}} >
                <Header style={{justifyContent: 'flex-start', paddingTop: (Platform.OS==='ios') ? 23 : 9, height: theme.headerHeight}}>
                    <Grid>
                        <Col style={{flex:1}}>
                            <Button transparent onPress={() => this.props.popRoute()}>
                                <Icon name='ios-arrow-back' style={styles.titleArrow} />
                            </Button>
                        </Col>
                        <Col style={{flex:8, justifyContent:'center', alignItems:'center'}}>
                            <Text style={styles.titleText}>All Reviews</Text>
                        </Col>
                        <Col style={{flex:1}}>
                        </Col>
                    </Grid>
                </Header>
                <Content padder style={{backgroundColor: 'transparent'}} >
                    <Spinner visible={this.state.isLoading} />
                    {Review}
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

export default connect(null, bindAction)(ViewMoreReview);
