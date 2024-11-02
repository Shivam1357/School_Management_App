import { View, StyleSheet, Text, TouchableOpacity } from "react-native";


const AlertDialog = ({title,message,positiveText,positiveAction,negativeText,negativeAction}) => {


    return (
        <View style={styles.container}>
            <View style={styles.mainCard}>
                <Text style={{marginTop:10,fontSize:20}}>{title}</Text>
                <Text style={{marginTop:10}}>{message}</Text>
                <View style={{flexDirection:'row' ,alignSelf:'flex-end'}}>
                    {positiveText &&
                        <TouchableOpacity
                            onPress={() => positiveAction()}
                            style={styles.button}>
                                <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                    }
                    {negativeText && 
                        <TouchableOpacity
                            onPress={() => negativeAction()}
                            style={styles.button}>
                                <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    )
}


export default AlertDialog;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'gray',
        height:'100%',
        width:'100%',
        position:'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        //opacity:0.5,
        justifyContent:'center',
        alignContent:'center',
    },
    mainCard:{
        alignSelf:'center',
        backgroundColor:"white",
        padding:15,
        borderRadius:15,
        flexDirection:'column',

    },
    button:{
        paddingRight:15,
        paddingTop:20,
        paddingBottom:10
    },
    buttonText:{
        color:'black'
    }
})