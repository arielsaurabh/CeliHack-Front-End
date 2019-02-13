'use strict';

var Global = {
    //testing url
    // SERVER_URL: 'http://ec2-35-156-17-221.eu-central-1.compute.amazonaws.com/api/',
    //main url
    SERVER_URL: 'http://api.celihack.com/api/',
    //SERVER_URL: 'http://192.168.0.122:8000/api/',

    //login data
    user_token: null,
    user_id: 0,
    isGuest: false,
    dish_id: 0,
    location_state: 0,
    isReload: false,
    lang: 'En',
    //current location data
    current_lat: 0,
    current_lng: 0,

    // change location data
    changed_lat: 0,
    changed_lng: 0,

    // category list and image
    categoryList:[],
    categoriesEn:[],
    categoriesHb:[]
};


export default Global;
