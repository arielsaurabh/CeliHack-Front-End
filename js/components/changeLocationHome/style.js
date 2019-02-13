'use strict';

var React = require('react-native');

var { StyleSheet, Dimensions } = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
module.exports = StyleSheet.create({
	container: {
		flex: 1,
		width: null,
		height: null
	},
	cardContainerStyle: {
		width: deviceWidth * .825,
		height: deviceWidth * .82,
		alignSelf:'center',
		marginTop : deviceWidth * .063
	},
	card: {
		borderRadius: 5,
		overflow: 'hidden',
		borderColor: 'grey',
		borderWidth: 1,
		elevation: 1,
		backgroundColor:'#fff',
		
	},
	titleArrow:{
      fontSize: 40,
      lineHeight: 40
    },
	thumbnail: {
		flex: 3,
	},

	noMoreCards: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	_alignCol: {
		alignItems:'center',
		justifyContent:'center'
  	},
  	_titleText: {
		  fontSize:20,
		fontWeight:'bold',
		color: '#FFF'
	},
	_cardMainImage:{
		flex:1,
		flexDirection:'column',
		borderRadius:5,
		width:deviceWidth*0.822,
		height:deviceWidth*0.61
	},
	_cardSubImage:{
		flexDirection:'row',
		width:deviceWidth*0.82,
		height:deviceWidth*.1,
		alignItems:'center',
		justifyContent: 'space-between',
		position: 'absolute',
		bottom: 0
	},
	_cardNextPrevBtn:{
		flex:1,
		width:deviceWidth,
		flexDirection:'row',
		justifyContent:'space-between',
		padding:15
  	},
	_cardDistance:{
		backgroundColor:'transparent',
		color:'#74cdc1',
		textDecorationLine:'underline',
		marginTop:5
	},
	_cardSubImageView3:{
		flex:1,
		alignItems:'center',
		flexDirection:'row'
	},
	_cardSubTextReview:{
		backgroundColor: 'transparent',
		color: 'white',
		fontSize:20,
		marginLeft:10
	},
	_cardDishNameView:{flexDirection:'column', height: deviceWidth * .21},
	_cardDishNameIcon:{
		backgroundColor:'transparent',
		fontSize:22,
		marginLeft:5,
		color:'#74cdc1'
	},
	_allFoodCategory:{
		fontSize:18,
		color: '#FFF',
		marginLeft:5
	},
	_footer:{
		flex:1,
		flexDirection:'row',
		width:deviceWidth,
		justifyContent:'center',
		alignItems:'center'
	},

	_newDish:{
		marginLeft:10,
		fontSize:20,
		color: '#FFF'
	},
	_rateView:{
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},
	_rateText:{
		color:'#fff',
		backgroundColor:'transparent'
	}
});
