import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppRegistry, StyleSheet, Text, View, Image,TouchableOpacity,TouchableHighlight,  Dimensions} from 'react-native';
import { Button, Icon} from 'native-base';
import { replaceRoute, replaceOrPushRoute } from '../../actions/route';
import AppIntro from '../../control/react-native-app-intro/AppIntro';

const windowsWidth = Dimensions.get('window').width;
const windowsHeight = Dimensions.get('window').height;

class WalkThrough extends Component {

  onSkipBtnHandle = (index) => {
    this.navigateTo('login');
  }

  doneBtnHandle = () => {
    this.navigateTo('login');
  }

  nextBtnHandle = (index) => {
    console.log(index);
  }

  onSlideChangeHandle = (index, total) => {
    console.log(index, total);
  }

  replaceRoute(route) {
    this.props.replaceRoute(route);
  }
  
  navigateTo(route) {
    this.props.replaceOrPushRoute(route);
  }

  render() {
    return (
      <AppIntro
        customStyles={{
          dotStyle: { backgroundColor:'blue' },
        }}
        showDots={true}
        dotColor='grey'
        activeDotColor='rgba(77,216,193,0.7)'
        rightTextColor='grey'
        leftTextColor='grey'
        skipBtnLabel="Skip"
        doneBtnLabel="START"
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
        onSlideChange={this.onSlideChangeHandle} >

        
        <View style={[styles.slide]}>
                
            <Image style={{flex:1, width: windowsWidth, height: windowsHeight}} resizeMode={'stretch'} source={require('../../../img/intro_background.jpg')} >
                <View style={{position:'absolute', top: 25, width: windowsWidth, height: windowsHeight *.2}}>
                  <Image 
                      source={require('../../../images/category_o.png')} 
                      style={{flex:1, justifyContent:'center', alignItems:'center', width: null, height: null}}
                      resizeMode='stretch'>
                     <Text style={{color:'#fff', fontSize:23, fontWeight:'bold', textAlign:'center', marginLeft:15, marginRight:15}}>
                        Swipe right or tap V if you like the dish
                     </Text>
                  </Image>
                </View>
                <Image 
                  style={{position: 'absolute', top: windowsHeight * 0.25, left: windowsWidth * 0.15, width: windowsWidth * .7, height: windowsHeight * 0.7 }} 
                  resizeMode={'stretch'} 
                  source={require('../../../img/intro2.png')} />
            </Image>
           
        </View>
        <View style={[styles.slide]}>
            <Image style={{flex:1, width: windowsWidth, height: windowsHeight}} resizeMode={'stretch'} source={require('../../../img/intro_background.jpg')} >
                <View style={{position:'absolute', top: 25, width: windowsWidth, height: windowsHeight *.2}}>
                  <Image 
                      source={require('../../../images/category_o.png')} 
                      style={{flex:1, justifyContent:'center', alignItems:'center', width: null, height: null}}
                      resizeMode='stretch'>
                     <Text style={{color:'#fff', fontSize:23, fontWeight:'bold', textAlign:'center', marginLeft:15, marginRight:15}}>
                        Swipe left or tap X if you want to skip
                     </Text>
                  </Image>
                </View>
                <Image 
                  style={{position: 'absolute', top: windowsHeight * 0.25, left: windowsWidth * 0.15, width: windowsWidth * .7, height: windowsHeight * 0.7 }} 
                  resizeMode={'stretch'} 
                  source={require('../../../img/intro3.png')} />
            </Image>
        </View>
        <View style={[styles.slide]}>
            <Image style={{flex:1, width: windowsWidth, height: windowsHeight}} resizeMode={'stretch'} source={require('../../../img/intro_background.jpg')} >
                <View style={{position:'absolute', top: 25, width: windowsWidth, height: windowsHeight *.32}}>
                  <Image 
                      source={require('../../../images/category_o.png')} 
                      style={{flex:1, width: null, height: null}}
                      resizeMode='stretch'>
                      <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                          <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                              <Text style={{color:'#fff', fontSize:23, fontWeight:'bold', textAlign:'center', marginLeft:15, marginRight:15}}>
                                  See your favorite dishes by tapping the star
                              </Text>
                          </View>
                          <View style={{flex:1}}></View>
                      </View>
                  </Image>
                </View>
                <Image 
                    source={require('../../../img/intro4_icon.png')} 
                    style={{position:'absolute', top: windowsHeight *.2, left: windowsWidth * 0.15, width: windowsWidth * 0.7, height: windowsHeight *.27}}
                    resizeMode={'contain'} />
                <Image 
                    style={{position: 'absolute', top: windowsHeight * 0.4, left: windowsWidth * 0.15, width: windowsWidth * 0.7, height: windowsHeight * 0.7 }} 
                    resizeMode={'stretch'} 
                    source={require('../../../img/intro4.png')} />
            </Image>
        </View>
        <View style={[styles.slide]}>
            <Image style={{flex:1, width: windowsWidth, height: windowsHeight}} resizeMode={'stretch'} source={require('../../../img/intro_background.jpg')} >
                <View style={{position:'absolute', top: 25, width: windowsWidth, height: windowsHeight *.32}}>
                  <Image 
                      source={require('../../../images/category_o.png')} 
                      style={{flex:1, width: null, height: null}}
                      resizeMode='stretch'>
                      <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                          <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                              <Text style={{color:'#fff', fontSize:23, fontWeight:'bold', textAlign:'center', marginLeft:15, marginRight:15}}>
                                  Share feedbacks with other people with Celiac!
                              </Text>
                          </View>
                          <Image 
                            source={require('../../../img/intro5_icon.png')} 
                            style={{flex:1, width: windowsWidth * 0.7, height: null}}
                            resizeMode={'contain'} />
                      </View>
                  </Image>
                </View>
                <Image 
                  style={{position: 'absolute', top: windowsHeight * 0.4, left: windowsWidth * 0.15, width: windowsWidth * 0.7, height: windowsHeight * 0.7 }} 
                  resizeMode={'stretch'} 
                  source={require('../../../img/intro5.png')} />
            </Image>
        </View>
      </AppIntro>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
});

function bindActions(dispatch){
    return {
        replaceOrPushRoute:(route)=>dispatch(replaceOrPushRoute(route)),
        replaceRoute:(route)=>dispatch(replaceRoute(route))
    }
}
export default connect(null, bindActions)(WalkThrough);
