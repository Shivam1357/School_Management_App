import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import TopBar from "../components/TopBar";
import { firestore } from "../firebase";
import { collection, doc,getDocs,docs } from "firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AlertDialog from "../components/AlertDialog";

const PastNotifications = ({navigation}) => {
    const [allMessages, setallMessages] = useState(["hhelo"]);

    const [deleteMessageClicked, setDeleteMessageClicked] = useState(false);
    const [deleteMessageTimeSent, setDeleteMessageTimeSent] = useState("");
    const [deleteMessageMessage, setDeleteMessageMessage] = useState("");
    
    async function getData(){
        let a = [];
        const querySnapshot = await getDocs(collection(firestore, "AllTeachers","1000","Notifications"));
        //const querySnapshot = await firestore().collection("AllTeachers").doc("1000").collection("Notifications");
        querySnapshot.forEach((doc) => {
            a.push(doc.data())
        })
        return a
        //console.log(querySnapshot.docs.map(doc => doc.data()))
    }
    useEffect(() => {
        getData().then((data) =>{
            setallMessages(data); 
        })
    },[deleteMessageClicked] );


    function getTimeConverted(ms){
        var t = new Date(Number(ms)).toLocaleString();
        return t;
    }

    function DeleteMessage(timeSent){
        setDeleteMessageClicked(false);
        console.log(timeSent);
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
                        {allMessages.map((m) => 
                            <View style={styles.messageView}>
                                {/* <Text>{JSON.stringify(m)}</Text> */}
                                <TouchableOpacity 
                                    onPress={() => {
                                        setDeleteMessageMessage(m.message),
                                        setDeleteMessageTimeSent(m.timeSent),
                                        setDeleteMessageClicked(true)
                                    }} 
                                    style={styles.messageDeleteButton}>
                                    <FontAwesome name="times" size={15} color={"black"} /> 
                                </TouchableOpacity>
                                <Text style={styles.messageMessage}>{m.message}</Text>
                                <Text style={styles.messageClassSend}>{JSON.stringify(m.classesSend)}</Text>
                                <Text style={styles.messageTime}>{getTimeConverted(m.timeSent)}</Text>
                            </View>
                        ) }
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
                negativeAction={() =>setDeleteMessageClicked(false)} />
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