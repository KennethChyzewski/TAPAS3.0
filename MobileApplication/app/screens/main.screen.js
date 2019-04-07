import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, AsyncStorage } from 'react-native';

import { inject } from 'mobx-react'; // takes the store and injects it into the class
import firebase from 'firebase';
import { Button } from 'native-base';
import { NavigationActions } from 'react-navigation';

var CryptoJS = require("crypto-js");




@inject("stores") //inject all the stores here and so props refers to this!
export default class MainScreen extends Component {

    async getExtensionInformation() {
        try {
            const data = await AsyncStorage.getItem("Extensions_information");
            const extensions = JSON.parse(data);
            return extensions;
        }
        catch (error) {
            alert("Error retrieving data: " + error);
        }
    }

    constructor(props) {
        super(props)
        // this.state = {
        //     extensions: []
        // };

        // this.getExtensionInformation().then((extensions) => {
        //     this.setState({ extensions: extensions });
        //     // alert(JSON.stringify(extensions));
        // }).catch((error) => {
        //     console.log('Promise is rejected with error: ' + error);
        // });
    }


    componentDidMount() {
        const { stores, navigation } = this.props;
        // this.checkIfLoggedIn();

        // ==================== AES ENCRYPTION STUFF ======================
        // Encryption
        var ciphertext = CryptoJS.AES.encrypt('password123', 'secret key 123').toString();

        // Decryption
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        // ==================== Hash using SHA 256 ==========================
        // Hashed username + site
        var hashedUS = CryptoJS.SHA256("usernameSitename")

        var extensionList = []
        this.getExtensionInformation().then((extensions) => {
            //alert(JSON.stringify(extensions))
            // ========================= PRINTING VALUES OF THE AES ENCRYPTION OR HASH =====================
            // alert(ciphertext + " orignal text: " + originalText)
            //alert(hashedUS)
            if (extensions != null && extensions != "null") {
                setTimeout(() => {
                    navigation.navigate("Ibad")
                }, stores.config.MainTime
                )
            } else {
                setTimeout(() => {
                    navigation.navigate("Login")
                }, stores.config.MainTime
                )
            }

        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });


    }
    // checkIfLoggedIn = ()=>{
    //     firebase.auth().onAuthStateChanged(user =>{
    //         if(user){

    //         }
    //     })
    // }
    render() {
        const { stores } = this.props
        return (
            <View style={{ flex: 1 }}>
                <Image style={{ flex: 1, width: null, height: null }} source={stores.config.MainImg} />
            </View>
        );
        // return(
        //     <View>
        //         <Text>test</Text>
        //     </View>
        // );
    }
}

const styles = StyleSheet.create({

});