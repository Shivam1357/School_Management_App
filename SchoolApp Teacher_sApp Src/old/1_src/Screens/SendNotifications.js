import React, { useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import TopBar from "../components/TopBar";


const SendNotifications = ({navigation}) => {
    const [classN, setClassN] = useState("XII (A)");
    const [classCode, setClassCode] = useState("");
    const [message, setMessage] = useState("Tommorow is Holiday");
    const [sendInProgress, setsendInProgress] = useState(false);
    const [messageSendSuccess, setMessageSendSuccess] = useState(false);


    function SendMessageClicked(){


        setsendInProgress(true);
        setTimeout(() => {
            setsendInProgress(false);
            setMessageSendSuccess(true);
        }, 2000);



        
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
                 {!messageSendSuccess &&
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