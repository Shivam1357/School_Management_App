import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

const MainPageDisplay = ({navigation}) => {

    let name = "Shivam Jaiswal";


    return (
        <View style={styles.container}>
            <Text style={{fontSize:20}}>Welcome,{name}</Text>
            
            <View style={styles.navButtonsView}>
            <Text style={{fontSize:16,marginLeft:5}}>Quick Links:</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SendNotification')}
                    style={styles.navButtons}>
                    <Text style={styles.navButtonsText}>Send New Notification</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('PastNotifications')}
                    style={styles.navButtons}>
                    <Text style={styles.navButtonsText}>View Past Notifications</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default MainPageDisplay

const styles = StyleSheet.create({
    container:{
        padding:10, 
    },
    navButtonsView:{
        paddingTop:10,
        paddingBottom:10,
        borderColor:'gray',
        borderStyle:'solid',
        borderWidth:1,
        padding:5,
        borderRadius:10
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