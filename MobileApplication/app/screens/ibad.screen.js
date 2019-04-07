import React, {Component} from 'react';
import {inject} from 'mobx-react';
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import firebase from 'firebase';
var CryptoJS = require("crypto-js");


import {
    Header,
    ListItem,
    Button,
    Overlay,
    Avatar
  } from "react-native-elements";

import {Permissions, Notifications} from 'expo';
import Sites from "../components/Sites";
import { AsapScheduler } from 'rxjs/scheduler/AsapScheduler';


@inject("stores")
export default class IbadScreen extends Component{

    async savePasswords(passwords){
      try{
        await AsyncStorage.setItem('passwords', JSON.stringify(passwords));
      }catch(error){
        alert("Error storing Pdata: " + error);
      }
    }
    async getPasswords(){
        try{
            const data = await AsyncStorage.getItem('passwords');
            const passwords = JSON.parse(data);
            return passwords;
        }
            catch(error){
                alert("Error retrieving Pdata: " + error);
        }
        
    }
    async getToken(){
      try {
          const value = await AsyncStorage.getItem('token');
          return value;
      } catch (error) {
        
          alert("Error retrieving token data: " + error);
      }
  }
    async saveLists(sites){
      try{
        await AsyncStorage.setItem('sites', JSON.stringify(sites));
        
      }catch(error){
        alert("Error storing data: " + error);
      }
    }
    async getLists(){
        try{
            const data = await AsyncStorage.getItem('sites');
            const sites = JSON.parse(data);
            if (data==null || data=="null"){
              this.savePasswords({}).then(()=>{
                return [];
              });
            }
            return sites;
        }
            catch(error){
                alert("Error retrieving data: " + error);
        }
        
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

      //await AsyncStorage.setItem("token", newToken);

      this.setState({
        phoneid: token
      });
      
    }
    componentDidMount(){
      this.registerForPushNotifications();
      this._notificationSubscription = Notifications.addListener(this._handleNotification);
      this.getLists().then((sites) => {
        if (sites == null){
          sites = [];
        }
        this.setState({sites});

      });
      
    }
    async componentDidUpdate(){
      this.saveLists(this.state.sites);
    }

    constructor(){
        super();
        // let sites = this.getLists();
        // if (sites!=null && sites!="null") {
        //   alert("Empty");
        //   sites = [];
        // };
        this.state = {sites: [], isRequestingPass: false};
        this.sendPass = this.sendPass.bind(this);

        // this.getLists().then((sites) => {
        // //   this.setState({sites: sites});
        // // }).catch((error) => {
        // //   alert("ERROR constructor ibadscreen: " + error)
        // // }); 
        //AsyncStorage.clear();

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
        alert("ERROR sending ibadscreen: " + error);
      });
    }

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
    _handleNotification = ({origin, data}) => {
      //alert(JSON.stringify(data));
      var eID = data['eID'];
      //alert("Recieved notif");
  
      // Decryption
      // var bytes = CryptoJS.AES.decrypt(data['message'], aesKey);

      //var message = bytes.toString(CryptoJS.enc.Utf8);

      var message = data['message'];

      if(data['type'] == 'newPass'){
        
        const {username, site, pass} = message;
        
        var hash = CryptoJS.SHA256(username+site).toString();

        this.getToken().then((phone) => {
          
          //alert(JSON.stringify(phone));

          firebase.database().ref('phones/'+ phone).update(
            {
              [hash] :{username, site}
            }
          )
                    
          this.getPasswords().then((passwords) => {
            //alert("1: "+ JSON.stringify(passwords));
            if (passwords==null || passwords=="null") passwords = {};
            passwords.hash = pass;

            this.savePasswords(passwords).then((passwords) => {
              //alert("2: "+ JSON.stringify(passwords));

              alert('New username added: '+ username);

              this.getExtensionInformation().then((extensions) => {
                for (i = 0; i < extensions.length; i++) {
                    var token = extensions[i].extension_token;
                    var aesKey = extensions[i].aes_key;

                    var message={
                      "type": "updateUserList"
                    }
                    //alert("sending update");
                    this.sendToExtension(token, message);

                    
                }

                // var aesKey = eID;
                
                // var newPass = CryptoJS.AES.decrypt(pass, aesKey).toString(CryptoJS.enc.Utf8);
                // alert("newpass: " + newPass);

                let newSite = {id: hash, name: username, avatar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNWXZpYwZ-A_2gNQNqXTRF31J-uCZzLoDI1g0Egg7jcPx7XlM-", website: site, pass};
                this.setState({sites: [...this.state.sites, newSite]});
 
            });
            });
          });
        });
        
      } else if(data['type'] == 'requestPass'){
        
        const {username, site} = message;
        var hash = CryptoJS.SHA256(username+site).toString();

        let siteIndex = -1;
        for (let index = 0; index < this.state.sites.length; index++) {
          if(this.state.sites[index].id==hash){
            siteIndex = index;
            break;
          }
        }
        if(siteIndex !=-1){
          this.setState({
            isRequestingPass: true,
            requestingEID: eID,
            requestingHash: hash,
            requestedID: siteIndex
          });
        }
      }else{
        alert("Error: wrong notification");
      }

    };

    delSite = async (id) => {
      this.setState({sites: [...this.state.sites.filter(site => site.id !== id)]});
      this.getToken().then((phone) => {

        firebase.database().ref('phones/'+ phone).child(id).remove();

        this.getExtensionInformation().then((extensions) => {
          for (i = 0; i < extensions.length; i++) {
              var token = extensions[i].extension_token;
              var aesKey = extensions[i].aes_key;

              var message={
                "type": "updateUserList"
              }
              this.sendToExtension(token, message);
          }
        });
      });
    }

    sendPass(i){ 
     
        var pass = this.state.sites[this.state.requestedID].pass;

        this.getExtensionInformation().then((extensions) => {
            for (i = 0; i < extensions.length; i++) {
              if(this.state.requestingEID == extensions[i].extension_token){

                var token = extensions[i].extension_token;
                var aesKey = extensions[i].aes_key;
                
                // Encryption
                // var ciphertext = CryptoJS.AES.encrypt(pass, aesKey).toString();

                var message={
                  "type": "requestPass",
                  "hash": this.state.requestingHash,
                  "pass": pass
                }
                //alert('Sending pass over: ', pass);
                this.sendToExtension(token, message);
              }
                
            }
          this.setState({isRequestingPass: false});
        });
     
    }
    renderPopUp(){
      if(this.state.isRequestingPass){
        
        const i = this.state.requestedID;
        return(
        <Overlay
        isVisible={true}
        width={250}
        height={250}
        onBackdropPress={() => this.setState({ isVisible: false })}
        >
        <View style={styles.container}>
            <Avatar rounded source={{ uri: this.state.sites[i].avatar_url }} size="large" />
            <Text style={{ padding: 10 }}>
            {this.state.sites[i].website} requests your password.
            </Text>
            <Button title="Send password" onPress={() => this.sendPass(i)}/>
        </View>
        </Overlay>
        )
      }
    }
    render(){
        return (
        <View>
            {/* <Header
            backgroundColor={"black"}
            leftComponent={{ icon: "menu", color: "#fff" }}
            centerComponent={{
                text: "Tapas 3.0",
                style: { color: "#fff", fontSize: 20 }
            }}
            /> */}
            {this.renderPopUp()}
            <Sites sites={this.state.sites} delSite= {this.delSite} />
        </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center"
    }
  });
  