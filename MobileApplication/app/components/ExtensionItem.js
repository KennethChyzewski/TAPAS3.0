import React, { Component } from "react";
import { Text, View } from "react-native";
import { Header, ListItem, Button, Overlay, Avatar } from 'react-native-elements';
var CryptoJS = require("crypto-js");


export default class ExtensionItem extends Component {
  
  render() {
    const {extension_token, aes_key} = this.props.extension;
    const extension_number = this.props.number;
    // Hashed extensionID
    // var hashedextID = CryptoJS.SHA256("ExtensionID"+extension_number)

    return (
      <ListItem
        leftAvatar={{ source: { uri: 'https://cnet3.cbsistatic.com/img/Yt768C55hXNi2eGSB9qOv-e7SQg=/2011/03/16/c7675aa8-fdba-11e2-8c7c-d4ae52e62bcc/Chrome-logo-2011-03-16.jpg' } }}
        title={"Extension #" +extension_number}
        subtitle={"ExtensionID: " + extension_token}
      />
    );
  }
  
}


// https://cnet3.cbsistatic.com/img/Yt768C55hXNi2eGSB9qOv-e7SQg=/2011/03/16/c7675aa8-fdba-11e2-8c7c-d4ae52e62bcc/Chrome-logo-2011-03-16.jpg