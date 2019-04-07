import {observable, action} from 'mobx';
import firebase from 'firebase';

export default class AuthStore{
    @observable authUser = null; //represents the current user logged in
    
    constructor(){
        // this.test = "hEYYYY"

        //when authentication state changes in firebase, it calls this handler and updates our user
        firebase.auth().onAuthStateChanged((user)=>{
            this.authUser = user
        })
    }
    //mobx functions that cause some side effects back to the database
    @action
    signIn({email,password}){
        alert(email)
        if(this.authUser){
            return Promise.resolve(this.authUser)
        }
        
        // var errorCode=''
        // var errorMessage='' 
        return firebase.auth().signInWithEmailAndPassword(email, password)
        // .catch(function(error) {
        //     this.errorCode = error.code;
        //     this.errorMessage = error.message;
        // });
// 
        // return errorCode
        // alert(this.authUser)

        // return errorCode + errorMessage
    }


    @action
    registerPhoneInDatabase({phoneToken}){
        return firebase.database().ref('phones/').update(
            {
                [phoneToken]: {
                    "ccb200748a9304f5a2436e6f4039362144bf95fbfb391b451a5481d5deb964cd": {
                        username: 'testuser',
                        site: 'test'
                    }
                }
            }
        )
    }

    @action
    registerExtensionWithPhone({phoneId, extensionId}){
        return firebase.database().ref('Extension/'+ extensionId).set(
            {
                PhoneId: phoneId
            }
        )
    }

}