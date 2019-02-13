'use strict';

import React, { Component } from 'react';
import { View, Platform, Image, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Text, Button, Icon, InputGroup, Input, Content} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import CheckBox from 'react-native-custom-checkbox';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import Autocomplete from 'react-native-autocomplete-input';

import theme from '../../themes/base-theme';
import styles from './styles';

import { popRoute, pushNewRoute, replaceRoute } from '../../actions/route';
import Global from '../../Global';
import Util from '../../utils.js';
import {globalHome} from '../home/index.js';
export var globalAddNewDish = {};
import dismissKeyboard from 'react-native-dismiss-keyboard';

import ImageResizer from 'react-native-image-resizer';
var compressedImageUri;

var Analytics = require('react-native-firebase-analytics');
                
                

class AddNewDish extends Component {
    constructor(props){
        super(props);
        this.state={
            checked: true,
            selected: true,

            // state variable for dish
            DishName: '',
            Image: null,
            CategoryId:'',
            ShowCategoryId: 'Choose Food Category',
            Address:'',
            Latitude: 0.0,
            Longitude: 0.0,
            Price: 0.0,
            RestaurantName:'', 
            SideEffect: 0,
            Review:'',
            isLoading: false,
      };
    }
    componentDidMount() {
        console.log("Add new dish page initialize");
        globalAddNewDish.addNewDish = this;
    }
    popRoute() {
        this.props.popRoute();
    }
    navigateTo(route) {
        this.props.pushNewRoute(route);
    }
    onChecked(_checked){
        this.setState({ checked: !_checked });
    }
    onSelected(_selected){
       this.setState({ selected:_selected });
    }
    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            takePhotoButtonTitle: 'take a new photo',
            chooseFromLibraryButtonTitle: 'choose from library',
            storageOptions: { skipBackup: true }
        };
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                var source_upload;
                
                if (Platform.OS === 'android') {
                    source_upload = {uri: response.uri, isStatic: true};
                } else {
                    source_upload = {uri: response.uri.replace('file://', ''), isStatic: true};
                }
                if ( response.width > response.height ) {
                    ImageResizer.createResizedImage(response.uri, response.width * 600 / response.height , 600, 'JPEG', 50).then((resizedImageUri) => {
                        compressedImageUri = resizedImageUri;
                    }).catch((err) => {
                        return;
                    });
                } else {
                    ImageResizer.createResizedImage(response.uri, 600, response.height * 600 / response.width , 'JPEG', 50).then((resizedImageUri) => {
                        compressedImageUri = resizedImageUri;
                    }).catch((err) => {
                        return;
                    });
                }
                
                this.setState({ Image: source_upload });
            }
        });
    }
    changeCategoryID(showCategoryId, categoryId) {
        if( showCategoryId === '') {
            this.setState({
                ShowCategoryId: 'Choose Food Category',
                CategoryId: categoryId,
            });   
        }else {
            this.setState({
                ShowCategoryId: showCategoryId,
                CategoryId: categoryId,
            });
        }
    }
    changeRestaurantName(restaurantName) {
        this.setState({ RestaurantName: restaurantName });
    }
    changeRestaurantNameAndAddress(restaurantName, address, latitude, longitude) {
        this.setState({
            RestaurantName: restaurantName,
            Address: address,
            Latitude: latitude,
            Longitude: longitude,
        });
    }
    changeAddress(address, latitude, longitude) {
        this.setState({
            Address: address,
            Latitude: latitude,
            Longitude: longitude,
        });
    }
    AddDishData() {
        var filename = Util.makeid();
        var formdata = new FormData();
        filename = filename + '.jpg';
              
        if(this.state.Image != null  && this.state.DishName != ''
            && this.state.Address != '' && this.state.RestaurantName != '' && this.state.Review != '') {
            formdata.append('Image', {uri: compressedImageUri, name: filename, type: 'image/jpg'});
            formdata.append('DishName',     this.state.DishName);
            formdata.append('UserId',       Global.user_id);
            if (this.state.checked === false ) 
                formdata.append('Anonymous',     1);
            if (this.state.CategoryId === '') {
                formdata.append('CategoryId', '0')
            }else{
                formdata.append('CategoryId',   this.state.CategoryId);
            }
            formdata.append('Address',      this.state.Address);
            formdata.append('Longitude',    this.state.Longitude);
            formdata.append('Latitude',     this.state.Latitude);
            formdata.append('Price',        this.state.Price);
            formdata.append('RestaurantName', this.state.RestaurantName);
            if (this.state.selected === true) {
                formdata.append('SideEffect', 1);
            } else {
                formdata.append('SideEffect', 0);
            }
            formdata.append('Review',       this.state.Review);
            
            this.setState({ isLoading: true });
            Global.isReload = true;

            console.log(Global.SERVER_URL + 'dish/add');
            console.log(formdata);

            fetch(Global.SERVER_URL + 'dish/add', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                method: "POST",
                body: formdata
            })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                Global.dish_id = responseData.DishId;
                this.setState({ isLoading: false });
                Analytics.logEvent('add_new_dish', null);
                this.props.replaceRoute('presentation');
            })
            .done();
        } else {
            Alert.alert('Invalid info','Input all fields to upload your Dish');
        }
    }
    gotoBackButton() {
        debugger;
        if (this.state.Review != '' || this.state.DishName != '' || this.state.Image != null || this.state.CategoryId !='' 
            || this.state.Address != '' || this.state.Price != '' || this.state.RestaurantName != '') {
            Alert.alert(
                            '',
                            'Discard Dish?',
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
    hideKeyboard() {
        Keyboard.dismiss();
    }
    render() {
        let emoji_like1,emoji_like2;
        emoji_like1 = this.state.selected ?
          (<Image style={styles.emoji1} resizeMode={'stretch'} source={require('../../../images/emoji1.png')}/>)
          :
          (<Image style={styles.emoji1} resizeMode={'stretch'} source={require('../../../images/emoji_1.png')}/>);
        emoji_like2 = this.state.selected ?
          (<Image style={styles.emoji2} resizeMode={'stretch'} source={require('../../../images/emoji_2.png')}/>)
          :
          (<Image style={styles.emoji2} resizeMode={'stretch'} source={require('../../../images/emoji2.png')}/>);
        const comp = (s, s2) => s.toLowerCase().trim() === s2.toLowerCase().trim();
        return (
            <Container theme={theme} style={{backgroundColor: theme.defaultBackgroundColor}}>
                <Header style={{height: theme.headerHeight, justifyContent: 'flex-start', paddingTop: (Platform.OS==='ios') ? 23 : 9}}>
                  <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <Button transparent onPress={() => this.gotoBackButton()}>
                        <Icon name='ios-arrow-back' style={styles.titleArrow} />
                    </Button>
                    <Text style={{flex:1}}>Thank you for sharing and helping others</Text>
                  </View>
                </Header>
                <Content scrollEnabled={true} style={styles._contentView}>
                    <Spinner visible={this.state.isLoading} />
                    <InputGroup borderType='regular' style={{justifyContent:'center', alignItems:'center'}}>
                        <Input placeholderTextColor={theme.customColor} placeholder='Dish Name' onChangeText={(DishName) => this.setState({DishName})}/>
                    </InputGroup>
                    <View style={{alignItems:'center', marginTop:5}}>
                      <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                        { this.state.Image === null ? <Image style={styles.avatarImage} source={require('../../../images/addphoto.png')}/> :
                          <Image style={styles.avatarImage} source={this.state.Image} />
                        }
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles._foodCategory} onPress={() => this.navigateTo('chooseCategory')}>
                        <Text numberOfLines={1} style={this.state.ShowCategoryId === 'Choose Food Category' ?styles._foodCategoryText: styles._foodCategoryTextMain}>{ this.state.ShowCategoryId }</Text>
                        <Icon name='ios-arrow-dropdown-circle' style={{color:theme.iconColor, marginRight:10}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles._foodAddress} onPress={() => this.navigateTo('chooseRestaurant')}>
                        <Icon name='ios-restaurant' style={{color:theme.iconColor, marginLeft:10}}/>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={this.state.RestaurantName === '' ?styles._foodAddresText: styles._foodAddresTextMain}>{ this.state.RestaurantName ==='' ? 'Restaurant Name': this.state.RestaurantName }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles._foodAddress} onPress={() => this.navigateTo('chooseAddress')}>
                        <Icon name='ios-pin' style={{color:theme.iconColor, marginLeft:10}}/>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={this.state.Address === '' ?styles._foodAddresText: styles._foodAddresTextMain}>{ this.state.Address === '' ? 'Address': this.state.Address}</Text>
                    </TouchableOpacity>
                    <View style={styles.priceView}>
                        <Image style={styles.priceImage} resizeMode={'stretch'} source = {require('../../../images/price.png')}/>
                        <Input placeholderTextColor={theme.customColor} placeholder='Price' onChangeText={(Price) => this.setState({Price})}/>
                    </View>
                    <View style={styles._emojiView}>
                        <Text style={{color:theme.customColor, marginRight:10}}>Side Effects</Text>
                        <TouchableOpacity onPress={() => this.onSelected(true)}>
                          {emoji_like1}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onSelected(false)}>
                          {emoji_like2}
                        </TouchableOpacity>
                    </View>
                    <InputGroup borderType='regular' >
                       <Icon name='ios-chatbubbles' style={{color:theme.iconColor}}/>
                       <Input   multiline = {true} 
                                numberOfLines={4} 
                                blurOnSubmit={(Platform.OS==='ios') ? true: false}  
                                onSubmitEditing={dismissKeyboard}
                                style={{marginTop:5, justifyContent:'center', alignItems:'center'}} 
                                placeholderTextColor={theme.customColor} 
                                placeholder='Write a Review' 
                                onChangeText={(Review) => this.setState({Review})}/>
                    </InputGroup>
                   <View style={styles.checkboxView}>
                        <CheckBox
                          style={{backgroundColor: '#f2f2f2', color:theme.iconColor, borderRadius: 5, borderWidth: 2}}
                          checked={this.state.checked}
                          onChange={(checked) => this.onChecked(this.state.checked)}
                        />
                        <Text style={{color:theme.customColor, marginLeft:10}}>Show My User Name</Text>
                   </View>
                   <Button block onPress={() => this.AddDishData()} textStyle={{color: '#fff'}}>SAVE</Button>
                </Content>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: () => dispatch(popRoute()),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route)),
        replaceRoute:(route) => dispatch(replaceRoute(route))
    }
}

export default connect(null, bindAction)(AddNewDish);
