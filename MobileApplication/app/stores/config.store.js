import firebase from 'firebase';


const config = {
    apiKey: "AIzaSyBcG44HsOq55TM3WkbKUUBcyM6fhiux_B4",
    authDomain: "tapas-7e377.firebaseapp.com",
    databaseURL: "https://tapas-7e377.firebaseio.com",
    projectId: "tapas-7e377",
    storageBucket: "tapas-7e377.appspot.com",
    messagingSenderId: "1030918840491"
};

export default class ConfigStore {
    constructor(){
        firebase.initializeApp(config);
        this.mainTime = 1000
        this.mainImg = require("../../images/main.jpg")
        this.loginBG = require("../../images/main.jpg")
    }

    get MainImg(){
        return this.mainImg
    }
    get MainTime(){
        return this.mainTime
    }
    get LoginBG(){
        return this.loginBG
    }
}