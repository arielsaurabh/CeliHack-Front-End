'use strict';

import React,{ Component } from 'react';
import AppNavigator from './AppNavigator';

class App extends Component {
    render() {

        // var formdata = new FormData();
        // let api = 'dish/all_user';
        // formdata.append('UserId', 5);
        // formdata.append('Latitude', 32.088167);
        // formdata.append('Longitude', 34.877744);
        //
        // console.log("aaa1: " + "http://appi.celihack.com/" + api + "\n" + formdata.toString());
        // fetch( "http://api.celihack.com/" + api, {
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'multipart/form-data',
        //     },
        //     method: "POST",
        //     body: formdata
        // })
        //     // .then((response) => response.json())
        //     .then((responseData) => {
        //
        //         console.log("aaa2: responseData = " +
        //             JSON.stringify(responseData)
        //             // responseData
        //         );
        //
        //
        //     })
        //     .done();
        // console.log("1asaf1");
        return(
            <AppNavigator store={this.props.store} />
        );
    }
}

export default App
