import React, {Component} from 'react';
import { Image,StyleSheet, View, Text, AsyncStorage} from 'react-native';

import ExtensionItem from './ExtensionItem';

export default class Extensions extends Component {

    render(){
        return(
            // <Text>HEY</Text>
            this.props.extensions.map((l,index) => (
            <ExtensionItem extension={l} number={index+1}/>
            ))
            
          
        );
    }
}