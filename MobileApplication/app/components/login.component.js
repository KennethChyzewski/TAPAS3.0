import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { Button, Item, Input, Text, Form } from 'native-base';
import firebase from 'firebase';
import { Constants } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { black } from 'ansi-colors';

@observer // this component will be observing
export default class Login extends Component {

    @observable email = '';
    @observable password = '';

    constructor(props) { // we didnt do inject for props here because we are getting our properties from 
        super(props)    // our screen and it already injects stores

    }
    componentDidMount() {
        // this stuff needs to be in auth.store
        // var key = firebase.database().ref('/Extension').push().key
        // firebase.database.ref("/Extension").child(key).set({ext2: "TEST"})
        // firebase.database.ref("/Extension").set(
        //     {
        //         exten1234: "phone1234"
        //     }
        // )
        // alert(Constants.deviceId)
        const { auth } = this.props.stores
        // auth.testdata().then((result) =>{
        //     // alert("result: " + result)
        // })
        // .catch((error)=>{
        //     // alert("ERROR: " + error)
        // })
    }


    pairDevice() {
        const { auth } = this.props.stores
        // alert(this.email +this.password)
        const { navigate } = this.props.navigation // used to navigate thru different screens
        // auth.signIn({email: this.email, password: this.password}) //this function returns a promise
        //     .then((result)=>{ // catch the response here
        //         // alert(result)
        //         navigate('Ibad') // if promise completes navigate to ibads screen
        //     })
        navigate('Barcode')
    }

    render() {
        const { auth } = this.props.stores // wont be used here but its using observables so mobx needs to wathc this carefully

        return (
            <Form>
                
                <Button
                    block 
                    style={{ marginBottom: 10,
                    // color:"black",
                    backgroundColor:"#2b2a2a",
                    width:200,
                    marginLeft: 75}}
                    onPress={this.pairDevice.bind(this)}>
                    <Text bold style={{color:"white"}}> Pair Device </Text>
                </Button>
                <Text style={{color:"#565656", marginLeft: 120}}>Not yet paired...</Text>

            </Form>
        )
    }
}