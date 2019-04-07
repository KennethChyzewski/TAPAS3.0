import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import firebase from 'firebase';

import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, AsyncStorage, Alert } from 'react-native';
import { Constants, BarCodeScanner, Permissions, Notifications } from 'expo';
// import {Button, Item, Input, Icon, Text, Form} from 'native-base';
import { NavigationActions } from 'react-navigation';
var CryptoJS = require("crypto-js");
 
@observer // this component will be observing
export default class Barcode extends Component {

    @observable barcode_value = '';

    state = {
        hasCameraPermission: null,
        ExtensionInformation: null,
        total_extensions: 0,
    };

    componentDidMount() {
        this._requestCameraPermission();
    }


    _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted', //sets the hasCameraPermission to true or false
        });
    };

    async getExtensionInformation() {
        try {
            const data = await AsyncStorage.getItem("Extensions_information"); //get the most recent one added for time being
            // const data = await AsyncStorage.getAllKeys();
            const extension = JSON.parse(data);
            return extension;
        }
        catch (error) {
            alert("Error retrieving data::: " + error);
        }

    }
    sendToExtension(token, message){
        fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Authorization': 'key=AIzaSyDyQIKrg4kkkXXf72nnCL2Yq5TSMIJQEJE',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "data": message,
            "to": token,
          }),
        }).catch((error) => {
            alert("ERROR sendtoextension barcode: " + error);
        });
      }

    registerForPushNotifications = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
         // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
          // Android remote notification permissions are granted during the app
          // install, so this will only ask on iOS
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
  
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') { 
          return;
        } 
  
      
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        

        newToken = token.slice(18, token.length-1);

        await AsyncStorage.setItem("token", newToken);

        //alert("Token from barcode comp: ", newToken);

        this.setState({
            phoneid: token
          });
        
        //add token to fb
        var update = {};
        update['/expoToken2']=token;
        firebase.database().ref("phones").update(update);
        
    }
    async saveExtensionInformation() {
        try {
            // Create a key:value mapping of  {Extension_token:Aes_key}
            var extensions = await AsyncStorage.getItem("Extensions_information");
            // alert(extensions!="null")
            if (extensions!=null && extensions!="null") {
                // alert(extensions)
                extensions = JSON.parse(extensions)
                for (i = 0; i < extensions.length; i++) {
                    if (extensions[i].extension_token === this.state.ExtensionInformation.EXTENSION_TOKEN) {
                        alert("Extension Already Paired!")

                        return;
                    }
                }
                extensions.push({ extension_token: this.state.ExtensionInformation.EXTENSION_TOKEN, aes_key: this.state.ExtensionInformation.AES_KEY })
                await AsyncStorage.setItem("Extensions_information", JSON.stringify(extensions));
                alert("Succesfully Paired!")

            } else {
                
                //alert("here");

                // first time pairing to device
                await AsyncStorage.setItem("Extensions_information", JSON.stringify([{ extension_token: this.state.ExtensionInformation.EXTENSION_TOKEN, aes_key: this.state.ExtensionInformation.AES_KEY }]));
                await AsyncStorage.setItem("sites", JSON.stringify([]));
                await AsyncStorage.setItem("passwords", JSON.stringify({}));

                const { auth } = this.props.stores
            
                await this.registerForPushNotifications();
                var phoneToken = await AsyncStorage.getItem("token");

                auth.registerPhoneInDatabase({ phoneToken }) //Change Constants.deviceId to phone token
                    .then((result) => { // catch the response here
                        //alert(result)
                        // navigate('Ibad') // if promise completes navigate to ibads screen
                    })
                    .catch((error) => {
                        alert("ERROR First time pairing: " + error)
                    })
                
            }
            var token = this.state.ExtensionInformation.EXTENSION_TOKEN;
            await AsyncStorage.getItem("token").then((phoneToken)=>{
                    //alert(token);
                    // Encryption
                    var ciphertext = CryptoJS.AES.encrypt(phoneToken, this.state.ExtensionInformation.AES_KEY,  {iv: 0}).toString();
                    
                    var message={
                    "type": "initial",
                    "token": ciphertext
                    }
                this.sendToExtension(token, message);
            });

            

        } catch (error) {
            alert("Error barcode component: " + error);
        }
    }


    _handleBarCodeRead = data => {
        // Before sending user to next screen, the user should be pushed to database and added there
        // we first look for the qr code value in extension table and if it exists, then put our unique id there
        // otherwise 

        // this.setState({ parsedData: data })
        // alert(this.state.ExtensionInformation)
        var dataObj = JSON.parse(data.data);
        const { navigate } = this.props.navigation
        // alert("data object"+ JSON.stringify(dataObj))
        // alert("extension information: "+ JSON.stringify(this.state.ExtensionInformation ))

        var exists = false;


        // if(this.state.ExtensionInformation!=null && this.state.ExtensionInformation.EXTENSION_TOKEN == dataObj.EXTENSION_TOKEN){
        //     alert("Extension Already Paired!")
        //     navigate('Extensions'); 
        // }
        // alert(this.state.ExtensionInformation)
        if (this.state.ExtensionInformation == null || this.state.ExtensionInformation.EXTENSION_TOKEN != dataObj.EXTENSION_TOKEN) {
            //converts json stirng into an object (dataObj.AES_KEY or dataObj.EXTENSION_TOKEN)
            this.setState({ ExtensionInformation: dataObj, total_extensions: this.state.total_extensions + 1 },
                function () {
                    // alert(this.state.ExtensionInformation.AES_KEY);
                    this.saveExtensionInformation()
                    // alert("Succesfully Paired")
                    navigate('Extensions');

                }
            );

            // this.setState({ExtensionInformation:null})
        } else {
            navigate('Extensions');
        }

        // }




    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.hasCameraPermission === null ?
                    <Text>Requesting for camera permission</Text> :
                    this.state.hasCameraPermission === false ?
                        <Text >Camera permission is not granted</Text> :
                        <View>
                            {/* <Text style={{height:0}}>SCAN YOUR EXTENSION BARCODE!</Text> */}
                            <BarCodeScanner
                                onBarCodeRead={this._handleBarCodeRead}
                                style={{ height: 300, width: 300 }}
                            />
                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'black',
    },

    cameraBarcodeScannerWrapper: {
        overflow: 'hidden',
        width: 260,
        height: 200,
    },
    // container:{
    //     position: 'absolute',
    //     bottom: 0,
    //     left: 0,
    //     right: 0,
    // },
    loginBackground: {
        flex: 1,
        width: null,
        height: null
    },
    loginForeground: {
        flex: 1,
        marginTop: Dimensions.get("window").height / 1.75, //this will put login-component a little below middle of screen
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 90,
        bottom: 0
    }
});