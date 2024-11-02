import React, { useEffect, useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import TopBar from "../components/TopBar";
import {auth, firestore} from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";



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
    console.log(currentUser.uid);
    const [userUid, setUserUid] = useState(currentUser.uid);
    const [unqiueCode, setUnqiueCode] = useState("");
    const [name, setName] = useState("");
    const [classTeacherOf, setclassTeacherOf] = useState("");
    const [classCode, setclassCode] = useState(""); 

    async function GetUserData(){
        let a = [];
        const TeachersRef = collection(firestore, "AllTeachers");
        const q1 = query(TeachersRef, where("userUid", "==", userUid));
        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach((doc) => {
            a.push(doc.data())
        });
        return a
    }


    async function GetUserClassDetail(uCode){
        let a1 = []
        const classesRef = collection(firestore, "AllClass");
        const q2 = query(classesRef, where("classTeacherUniqueCode", "==", uCode));

        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            a1.push(doc.data())
        });

        return a1;
    }

    useEffect(() => {
        GetUserData().then((data) =>{
            setName(data[0].name)
            //console.log(data)data[0].unqiueCode
            GetUserClassDetail("1001").then((data2) =>{
                setclassTeacherOf(data2[0].class + "-" + data2[0].section)//JSON.stringify(data2))
                console.log("data:-" + data2)
            })
        })
    }, []);

    return(
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
    )
}