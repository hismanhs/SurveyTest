// Homescreen.js
import React, { Component } from 'react';
import { Button, View, Text,TouchableOpacity ,AsyncStorage} from 'react-native';
import { Request, AlertMessage } from '../Helper/HelperMethods';

import ImageSlider from 'react-native-image-slider';
 import DeviceInfo from 'react-native-device-info';

 export default class Homescreen extends Component {
  constructor() {
    super();
    this.state = {  
        macId: '' ,
        checkip:true
    };
}
componentDidMount() {
  this.LoadInitialData();
}
LoadInitialData = async () => {
  this.IP = await AsyncStorage.getItem("IP");
  this.Token = await AsyncStorage.getItem("Token");
  this.Getwelcome();
}

Getwelcome= async()=>{
  this.Token = await AsyncStorage.getItem("Token");
  console.log(this.Token)
  Request.get(`http://192.168.10.107:8965/api/Feedback/GetWelcomeAndThankyou`, this.Token)

  .then(res => {
      console.log(res)
  })
  .catch(err => {
     console.error(err);
     AlertMessage("Something Went wrong");
  });
}
  render() {
    if(this.state.checkip===true){
     DeviceInfo.getUniqueId()
     console.log(DeviceInfo.getUniqueId())
    //  .then((mac)=>{
    //   console.log("chek parm",mac)
       this.setState({macId:DeviceInfo.getUniqueId()})
       this.setState({checkip:false})
    //   console.log(this.state.macId)
    // })
  }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Unique Device Id</Text>
      <Text>{this.state.macId}</Text>
              {this.state.answersSoFar}
<TouchableOpacity
          onPress={() => this.props.navigation.navigate('Survey')}
>
        <ImageSlider 
			 autoPlayWithInterval={3000}
			 images={[
				 'https://placeimg.com/640/640/nature',
				 'https://placeimg.com/640/640/people',
				 'https://placeimg.com/640/640/animals',
				 'https://placeimg.com/640/640/beer',
		  ]}/> 
      </TouchableOpacity>
      </View>
    )
  }
}
