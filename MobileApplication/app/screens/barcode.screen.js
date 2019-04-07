import React, {Component} from 'react';
import {Container, Content} from 'native-base';
import {View,Text, Image, ImageBackground, StyleSheet, Dimensions} from 'react-native';
import {inject} from 'mobx-react';
import aes from 'crypto-js/aes';


import Barcode from '../components/barcode.component';

@inject('stores')
export default class BarcodeScreen extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const {stores} = this.props
        return (
            <Barcode {...this.props}> </Barcode>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    loginBackground:{
        flex:1,
        width:null,
        height:null
    },
    loginForeground:{
        flex:1,
        marginTop: Dimensions.get("window").height/1.75, //this will put login-component a little below middle of screen
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight:10,
        paddingBottom: 90,
        bottom:0
    }
})