import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
 

const TopBar = ({topText,firstIconName,firstIconClicked,secondIconName,secondIconClicked}) => {
    return (
        <View style={styles.container}> 
            <TouchableOpacity 
                onPress={() => firstIconClicked()} >
                    {firstIconName && 
                        <FontAwesome name={firstIconName} size={30} color={"black"} /> 
                    }
            </TouchableOpacity>
            
            <Text style={{fontSize:18}}>{topText}</Text>

            <TouchableOpacity 
                onPress={() => secondIconClicked()} >
                    {secondIconName && 
                        <FontAwesome name={secondIconName} size={30} color={"black"} /> 
                    }
            </TouchableOpacity>            
        </View>
    )
}

export default TopBar;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'orange',
        height:50,
        justifyContent:"space-between",
        alignItems:'center',
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
    }
})
