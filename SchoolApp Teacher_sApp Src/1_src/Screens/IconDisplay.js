import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react"
import { Alert, BackHandler, Image, Platform, SafeAreaView, StyleSheet, Text} from "react-native";
import { auth } from "../firebase";

const IconDisplay = ({navigation}) => {


    onAuthStateChanged(auth,user =>{
        if (user){
            navigation.navigate("Home")
        }
        else{
            navigation.navigate("Login")
        }
    })

    

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