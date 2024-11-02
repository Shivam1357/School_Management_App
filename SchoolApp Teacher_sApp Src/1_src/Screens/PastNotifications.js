import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import TopBar from "../components/TopBar";
import { firestore } from "../firebase";
import { collection, doc,getDocs,docs, deleteDoc } from "firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AlertDialog from "../components/AlertDialog";
import { GetAllClassesData, GetUserData } from "../components/GetFirebaseData";

const PastNotifications = ({navigation}) => {
    const [allMessages, setallMessages] = useState([]);

    const [classCodeValues, setClassCodeValues] = useState({});
    const [userUniqueCode, setUserUniqueCode] = useState("");

    const [deleteMessageClicked, setDeleteMessageClicked] = useState(false);
    const [deleteMessageTimeSent, setDeleteMessageTimeSent] = useState("");
    const [deleteMessageMessage, setDeleteMessageMessage] = useState("");
    const [deleteMessageClassCode, setDeleteMessageClassCode] = useState("");
    
    async function getAllNotificationsData(uniqueCode){
        let a = [];
        const querySnapshot = await getDocs(collection(firestore, "AllTeachers",String(uniqueCode),"Notifications"));
        //const querySnapshot = await firestore().collection("AllTeachers").doc("1000").collection("Notifications");
        querySnapshot.forEach((doc) => {
            a.push(doc.data())
        })
        return a
        //console.log(querySnapshot.docs.map(doc => doc.data()))
    }

    useEffect(() => {
        GetAllClassesData().then((classData) =>{
            var o = {};
            var i = 0;
            while (i < classData.length){
                o[classData[i]['classCode']] = classData[i]['class'] + "-" + classData[i]['section'] 
                i = i +1
            }
            setClassCodeValues(o);
            GetUserData().then((userData) =>{
                setUserUniqueCode(String(userData.uniqueCode))
                getAllNotificationsData(String(userData.uniqueCode)).then((data) =>{
                    setallMessages(data.reverse()); 
                })
            })
        })
    },[deleteMessageClicked] );


    function getTimeConverted(ms){
        var t = new Date(Number(ms)).toLocaleString();
        return t;
    }

    async function DeleteMessageDeleteUserDB(timeSent){
        await deleteDoc(doc(firestore, "AllTeachers",String(userUniqueCode),"Notifications",String(timeSent)));
    }
    async function DeleteMessageDeleteClassDB(timeSent){
        await deleteDoc(doc(firestore, "Notifications","Students",String(deleteMessageClassCode),String(timeSent)));
    }


    function DeleteMessage(timeSent){
        setDeleteMessageClicked(false);
        //console.log(" cll " + deleteMessageClassCode)
        DeleteMessageDeleteClassDB(timeSent).then(() =>{
            DeleteMessageDeleteUserDB(timeSent).then(() =>{
            })
        })
    }



    return (
        <View style={styles.container}>
            <View style={styles.mainArea}>
                <TopBar
                    topText="PastNotifications"
                    firstIconName={"arrow-left"}
                    firstIconClicked={() => {navigation.navigate("Home")}}
                    secondIconName={null}
                    secondIconClicked={() => {}} />
                <View style={styles.mainPageDisplay}>
                <ScrollView>
                    <View style={styles.allMessagesS}>
                        {allMessages.length != 0
                        ?
                        allMessages.map((m) => 
                            <View style={styles.messageView}>
                                {/* <Text>{JSON.stringify(m)}</Text> */}
                                <TouchableOpacity 
                                    onPress={() => {
                                        setDeleteMessageMessage(m.message),
                                        setDeleteMessageTimeSent(m.timeSent),
                                        setDeleteMessageClicked(true),
                                        setDeleteMessageClassCode(m.classesSend[0])
                                    }} 
                                    style={styles.messageDeleteButton}>
                                    <FontAwesome name="times" size={15} color={"black"} /> 
                                </TouchableOpacity>
                                <Text style={styles.messageMessage}>{m.message}</Text>
                                <Text style={styles.messageClassSend}>{classCodeValues[m.classesSend]}</Text>
                                <Text style={styles.messageTime}>{getTimeConverted(m.timeSent)}</Text>
                            </View>
                        )
                        :
                        <ActivityIndicator size="large" color="black" />
                        }
                    </View>
                </ScrollView>
                    {/* <Text>{JSON.stringify(allMessages)}</Text> */}
                </View> 
            </View>
            {deleteMessageClicked && 
            <AlertDialog
                title="Alert"
                message={`Are you sure to Pull Back this Message\n"${deleteMessageMessage}"`}
                positiveText="Yes"
                positiveAction={() => DeleteMessage(deleteMessageTimeSent)}
                negativeText="No"
                negativeAction={() => setDeleteMessageClicked(false)} />
             }
        </View>
    )
}


export default PastNotifications;

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
        paddingTop:10,
    },
    allMessagesS:{
        marginBottom:20,
        paddingBottom:20
    },
    messageView:{
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'gray',
        borderRadius:5,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:4,
        paddingBottom:4,
        margin:10,
        marginTop:3,
        marginBottom:3,
    },
    messageMessage:{
        fontSize:16,
        paddingRight:20
    },
    messageTime:{
        alignSelf:'flex-end'
    },
    messageClassSend:{
        alignSelf:'flex-end'
    },
    messageDeleteButton:{
        alignSelf:'flex-end'
    }
})