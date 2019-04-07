import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, AsyncStorage } from 'react-native';

import { inject } from 'mobx-react'; // takes the store and injects it into the class
import { Button } from 'native-base';

import Extensions from "../components/Extensions";
import {Header} from "react-native-elements";

@inject("stores") //inject all the stores here and so props refers to this!
export default class ExtensionsScreen extends Component {

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
        this.state = {
            extensions: []
        };

        this.getExtensionInformation().then((extensions) => {
            this.setState({ extensions: extensions });
            // alert(JSON.stringify(extensions));
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });


    }

    componentDidMount() {
        const { stores, navigation } = this.props;
        // this.checkIfLoggedIn();
        this.getExtensionInformation().then((extensions) => {
            this.setState({ extensions: extensions });
            // alert(JSON.stringify(extensions));
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });

    }


    componentDidUpdate() {
        this.getExtensionInformation().then((extensions) => {
            this.setState({ extensions: extensions });
            // alert(JSON.stringify(extensions));
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
      }


    render() {
        const { stores } = this.props
        return (
            <View style={{ flex: 1 }}>
                <Extensions extensions={this.state.extensions}></Extensions>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});