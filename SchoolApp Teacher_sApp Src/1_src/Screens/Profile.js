import React, { useEffect, useState } from "react"
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native"
import TopBar from "../components/TopBar";
import {auth, firestore} from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { GetUserClassDetail, GetUserData } from "../components/GetFirebaseData";



const Profile = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.mainArea}>
                <TopBar
                    topText="My Profile"
                    firstIconName={"arrow-left"}
                    firstIconClicked={() => {navigation.navigate("Home")}}
                    secondIconName={null}
                    secondIconClicked={() => {}} />
                <MainPageDisplay/>
            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container:{
        marginTop:Platform.OS == "web" ? 0 : 28,
        backgroundColor:'azure',
        height:'100%',
        width:'100%'

    },
    mainArea:{
        flex:1
    },
    mainPageDisplay:{
        flex:1,
        alignContent:'center',
        alignItems:'center',
        paddingTop:20,
        paddingBottom:20,
        paddingLeft:10,
        paddingRight:10
    },
    profilePicture:{
        height:100,
        width:100,
        borderRadius:50,
        marginBottom:10
    },
    otherDetails:{
        
    },
    otherDetailsText:{
        fontSize:16,
        marginTop:3,
        padding:10,
        paddingTop:4,
        paddingBottom:4,
        backgroundColor:'beige',
        borderRadius:10,
    }
})

function MainPageDisplay(){
    // const [fName, setfName] = useState("");
    // const [mName, setmName] = useState("");
    const {currentUser} = auth;
    const [userUid, setUserUid] = useState(currentUser.uid);
    const [name, setName] = useState("");
    const [classTeacherOf, setclassTeacherOf] = useState("");


    useEffect(() => {
        GetUserData(userUid).then((data) =>{
            setName(data.name);
            GetUserClassDetail(String(data.uniqueCode)).then((data2) =>{
                //setclassTeacherOf(JSON.stringify(data2))
                setclassTeacherOf(data2.class + "-" + data2.section)//JSON.stringify(data2))
            })
        })
    }, []);

    return(
        <View style={{flex:1}}>
            {name && classTeacherOf 
            ?
            <View style={styles.mainPageDisplay}>
                <Image
                    style={styles.profilePicture}
                    source={require("../assets/download1.jpeg")}/>
                <Text style={{fontSize:20}}>{name}</Text>
                <View style={styles.otherDetails}>
                    <Text style={styles.otherDetailsText}>Name : {name}</Text>
                    {/* <Text style={styles.otherDetailsText}>Father's Name:{fName}</Text>
                    <Text style={styles.otherDetailsText}>Mother's Name:{mName}</Text> */}
                    <Text style={styles.otherDetailsText}>Class Teacher Of : {classTeacherOf}</Text>
                </View>
            </View>
            :
            <ActivityIndicator size={"large"} color={"black"}/>
            }
        </View> 
    )
}