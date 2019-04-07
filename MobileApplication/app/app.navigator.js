import React from 'react';
import { createStackNavigator, createAppContainer, DrawerItems, NavigationActions, createDrawerNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation";
import MainScreen from "./screens/main.screen";
import LoginScreen from "./screens/login.screen";
import IbadScreen from "./screens/ibad.screen";
import BarcodeScreen from "./screens/barcode.screen";
import ExtensionsScreen from "./screens/extensions.screen";
import { ScrollView } from 'react-native-gesture-handler';
// import { ScrollView } from 'react-native';

import {Icon } from 'native-base';
// import {Icon } from '@expo/vector-icons/Ionicons';

import { Button } from 'react-native';

// const hiddenItems = [
//     'Main',
//     'Login',
// ]

// const SideBar = (props) =>{
//     const propsClone={
//         ...props,
//         items: props.items.filter(item => !hiddenItems.includes(item.key))
//     }
//     return(
//         <ScrollView>
//             <DrawerItems {...propsClone}/>
//         </ScrollView>
//     )
// }

// const MenuButton = ({navigate})=> (
//     <Button transparent
//         onPress={()=> {
//             navigate('DrawerOpen')
//         }}>
//         <Icon style={{color:"green"}} size={28} name="menu"/>
//         </Button>
// )

const Main = {
    screen: MainScreen,
    navigationOptions: {
        header: null
    }
}

const Login = {
    screen: LoginScreen,
    navigationOptions: {
        header: null

    }

}

const Ibad = {
    screen: IbadScreen,
    navigationOptions: {
        header: null
    }
}

const Barcode = {
    screen: BarcodeScreen,
    navigationOptions: {
        header: null
    }

}

const Extensions = {
    screen: ExtensionsScreen,
    navigationOptions: {
        header: null
    }

}

// const ExtensionsTabNavigator = createBottomTabNavigator({
//     List,
//     Pair
// })


const appDrawerNavigator = createDrawerNavigator({
    Main: Ibad,
    Extensions: Extensions,
    Pair: Barcode
}, {
        navigationOptions: ({navigation})=>{
            const {routeName} = navigation.state.routes[navigation.state.index]
            return{
                headerTitle: routeName
            }
        }
    }
)

const appStackerNavigator = createStackNavigator({
    appDrawerNavigator: appDrawerNavigator
},{
    defaultNavigationOptions:({navigation})=>{
        return {
            headerStyle:{
                backgroundColor:"black"
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerLeft:(
                <Icon style={{paddingLeft: 10, color:"white"}} 
                    onPress={()=>navigation.openDrawer()}
                name="menu" size={30}/>
            )
        }
    }
})

const RouteConfig = {
    initialRoute: 'Main',//refers to main const above
    // contentComponent: SideBar,
    // defaultNavigationOptions: {
    //     gestureEnabled: false
    // headerStyle: {
    //   backgroundColor: 'Orange',
    // },
    // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // }
    // }
}

// takes in two things, 1) route maping = differnet screens  2)Route config

// const AppNavigator = createStackNavigator({
const AppNavigator = createSwitchNavigator({
    Main: Main, //has a key of 'Main' and value of const Main made above
    Login: Login,
    Ibad: appStackerNavigator,
    Barcode: Barcode,
    Extensions: appStackerNavigator
}, RouteConfig);


// sets up a basic shell for our navigation  s
export default createAppContainer(AppNavigator);