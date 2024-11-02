import React from "react"
import { Image, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebase";

const IconDisplay = ({navigation}) => {
    const {currentUser} = auth;
    
    if (currentUser){
        navigation.navigate("Home")
        console.log(currentUser)
    }
    else{
        navigation.navigate("Login")
        console.log("no user")
    }
    

    return (
        <SafeAreaView style={styles.container}>
            <Image 
                style={styles.logo}
                source={require('../assets/download2.jpeg')}/>
            <Text style={styles.text}>
                Front Page Activity
            </Text>
        </SafeAreaView>
    )
}

export default IconDisplay;

const styles = StyleSheet.create({
    container:{
        marginTop:Platform.OS== "web" ? 0 :26,
        backgroundColor:'white',
        height:'100%',
        width:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    logo:{
        height:300,
        width:300
    },
    text:{
        fontSize:40,
        marginTop:40
    }
})