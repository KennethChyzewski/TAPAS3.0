import React, {Component} from 'react';
// import { StyleSheet, Text, View } from 'react-native';
import {Provider} from "mobx-react";
import AppNavigator from './app/app.navigator';
import stores from "./app/stores";
import{ StyleProvider} from 'native-base';
import getTheme from './native-base-theme/components';
import custom from './native-base-theme/variables/custom';
import {BackHandler} from 'react-native'

export default class App extends Component {

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  handleBackButton() {
    return true;
  }

  render() {
    return (
      // TODO: ===== try removing this stores={stores} and see if the pages where @inject("store") is plugged in works =====
      <Provider stores={stores}> 
        {/* apply style to all of the pages! */}
        <StyleProvider style = {getTheme(custom)}>
          {/* All the navigation is taken care of here! */}
          <AppNavigator/>    
        </StyleProvider>
      </Provider>
   
    );
  }
}


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
