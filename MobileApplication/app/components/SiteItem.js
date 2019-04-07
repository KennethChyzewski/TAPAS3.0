import React, { Component } from "react";
import { Text, View } from "react-native";
import { Header, ListItem, Button, Overlay, Avatar } from 'react-native-elements';


export default class SiteItem extends Component {
  render() {
    const {id, avatar_url, name, website} = this.props.site;
    return (
      <ListItem
        key= {id}
        leftAvatar={{ source: { uri: avatar_url } }}
        title={name}
        subtitle={website}
        rightElement={
          <Button title="Delete" onPress={this.props.delSite.bind(this, id)} buttonStyle={{ backgroundColor: "red" }} />
        }
      />
    );
  }
}
