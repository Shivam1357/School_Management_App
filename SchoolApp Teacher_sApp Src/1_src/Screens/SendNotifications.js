import React, { useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import TopBar from "../components/TopBar";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, firestore } from "../firebase";
import { GetUserClassDetail, GetUserData } from "../components/GetFirebaseData";

const SendNotifications = ({navigation}) => {
    const {currentUser} = auth;
    const userUid = currentUser.uid;
    const [userName, setUserName] = useState("");
    const [userUniqueCode, setUserUniqueCode] = useState("");
    const [classN, setClassN] = useState("");
    const [classCode, setClassCode] = useState("");
    const [message, setMessage] = useState("Tommorow is Holiday");
    const [sendInProgress, setsendInProgress] = useState(false);
    const [messageSendSuccess, setMessageSendSuccess] = useState(false);

    async function addNewMessageSendInClass(time){
        var data = {
            id:Math.floor((Math.random() * 9999) + 1000),
            message:message,
            sender:userName,
            senderUserUid:userUid,
            timeSent:time,
        }
        await setDoc(doc(firestore, "Notifications", "Students",String(classCode),String(time)), data);
    }
    async function addNewMessageSendInTeachersNotification(time){
        var data = {
            classesSend:[classCode],
            message:message,
            timeSent:time,
        }
        await setDoc(doc(firestore, "AllTeachers", String(userUniqueCode),"Notifications",String(time)), data);
    }

    useEffect(() => {
        GetUserData(userUid).then((data) =>{
            setUserName(data.name)
            setUserUniqueCode(data.uniqueCode)
            GetUserClassDetail(String(data.uniqueCode)).then((data2) =>{
                setClassCode(data2.classCode);
                setClassN(data2.class + "-" + data2.section)
                
                //setMessage(JSON.stringify(data2))
            })
        })       
        
    }, []);
    
    
    
    function SendMessageClicked(){
        var time = Date.now();
        setsendInProgress(true);
        addNewMessageSendInTeachersNotification(time).then(() =>{
            addNewMessageSendInClass(time).then(() => {
                setsendInProgress(false);
                setMessageSendSuccess(true);
            })
        })
    }


    return (
        <View style={styles.container}>
            <View style={styles.mainArea}>
                <TopBar
                    topText="Send New Notification"
                    firstIconName={"arrow-left"}
                    firstIconClicked={() => {navigation.navigate("Home")}}
                    secondIconName={null}
                    secondIconClicked={() => {}} />
                {messageSendSuccess &&
                    <View style={styles.mainPageDisplay}>
                        <Text style={{
                            fontSize:25,
                            color:'green',
                            fontWeight:"700"
                            }}>
                            Successfully Sent
                        </Text> 
                        <Text style={{
                            fontSize:16,
                            }}>
                            "{message}"
                        </Text>
                        <Text style={{
                            fontSize:17,
                            }}>
                            To Class-{classN}
                        </Text>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('PastNotifications')}
                            style={styles.navButtons}>
                            <Text style={styles.navButtonsText}>View Past Notifications</Text>
                        </TouchableOpacity>
                    </View>
                }
                {classCode && userUniqueCode && userName && userUid
                ?
                !messageSendSuccess &&
                    <View style={styles.mainPageDisplay}>
                        <Text 
                            style={{fontSize:15}}>
                                Type the Message you want to send to Class-{classN}
                        </Text>
                        <TextInput
                            style={{
                            backgroundColor:'white',
                            height:180,
                            borderStyle:'solid',
                            borderColor:"black",
                            borderWidth:1,
                            borderRadius:5,
                            padding:5,
                            textAlignVertical:'top'
                            }}
                            value={message}
                            onChangeText={(text) => setMessage(text)} 
                            multiline >
                        </TextInput>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity
                                onLongPress={() => SendMessageClicked()}
                                style={{...styles.buttons,backgroundColor:'blue'}}>
                                {!sendInProgress 
                                ?
                                <Text style={{color:'white'}}>Send</Text>
                                :
                                <ActivityIndicator size="small" color="white" />
                                }
                            </TouchableOpacity>
                            {!sendInProgress &&
                                <TouchableOpacity 
                                    onLongPress={() => setMessage("")}
                                    style={{...styles.buttons,backgroundColor:'red'}}>
                                    <Text style={{color:'white'}}>Reset</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View> 
                :
                <ActivityIndicator size="large" color="black"/>
                }
            </View>
        </View>
    )
}

export default SendNotifications;

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
        padding:10
    },
    buttons:{
        marginRight:20,
        marginTop:10,
        padding:10,
        borderRadius:10,
    },
    navButtons:{
        backgroundColor:"black",
        padding:10,
        borderRadius:15,
        marginTop:5,
        marginBottom:5
    },
    navButtonsText:{
        color:'white'
    }
})