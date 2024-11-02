import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth} from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';


const Login = ({navigation}) => {
    const [email, setEmail] = useState("shivam@lfs.com");
    const [password, setPassword] = useState("shivam");
    const [loginInProgress, setLoginInProgress] = useState(false);
    const [inputActive, setInputActive] = useState(true);
    const [error, setError] = useState("");
    const {currentUser} = auth;
    
    onAuthStateChanged(auth,user =>{
        if (user){
            setInputActive(true);
            setEmail("");
            setPassword("");
            setError("");
            setLoginInProgress("");
            navigation.navigate("Home")
        }
    })
    
    useEffect(() => {
      console.log("openLogi")
    }, []);
    

    function loginClicked(){
        navigation.navigate('Home');
        setLoginInProgress(true);
        setInputActive(false);
        //console.log(email + '-' + password);
        signInWithEmailAndPassword(auth,email, password)
        .then((userCredential) => {
            // Signed in
            setLoginInProgress(false);
            setInputActive(true);
            setEmail("");
            setPassword("");
            setError("");
            navigation.navigate('Home');
            //console.log(currentUser)
            // ...
        })
        .catch((error) => {
            setInputActive(true);
            setLoginInProgress(false);
            //var errorCode = error.code;
            var errorMessage = error.message;
            var a = errorMessage.substring(errorMessage.indexOf('/')+1, errorMessage.length - 2);
            a = a[0].toUpperCase() + a.substring(1,a.length)
            //console.log(a);
            setError(a);

        });
        
    
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.loginCard}>
                <Text style={styles.topText}>Teacher's Login</Text>
                <Text 
                    style={{
                        alignSelf:'center',
                        color:'red'
                    }}>
                    {error}
                </Text>
                <View style={styles.credentialAll}>
                    <Text style={styles.inputLabel}>
                        Email:
                    </Text>
                    <TextInput
                        editable={inputActive}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}>
                    </TextInput>
                </View>
                <View style={styles.credentialAll}>
                    <Text style={styles.inputLabel}>
                        Password:
                    </Text>
                    <TextInput
                        editable={inputActive}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}>

                    </TextInput>
                </View>
                <TouchableOpacity
                    onPress={loginClicked}
                    style={styles.loginButton}>
                    {!loginInProgress 
                    ? 
                    <Text style={{color:'white',...styles.inputLabel}}>Login</Text>
                    :
                    <ActivityIndicator size="large" color="white" />
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


export default Login

const styles = StyleSheet.create({
    container:{
        marginTop:Platform.OS == "web" ? 0 : 28,
        backgroundColor:'white',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgb(73,223,216)',
        backgroundColor: 'linear-gradient(180deg, rgba(73,223,216,1) 0%, rgba(191,231,232,1) 48%, rgba(73,223,216,1) 100%)'
    },
    loginCard:{
        backgroundColor:"gray",
        height:280,
        width:350,
        justifyContent:'center',
        backgroundColor: 'rgb(198,227,226)',
        backgroundColor: 'radial-gradient(circle, rgba(198,227,226,1) 0%, rgba(178,212,229,1) 33%, rgba(137,182,235,1) 100%)',
        paddingBottom:30,
        borderRadius:15,
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 1,
    
    },
    topText:{
        fontSize:30,
        margin:10,
        alignSelf:'center'
    },
    credentialAll:{
        flexDirection:'row',
        marginTop:10,
        marginBottom:10,
        marginRight:10,
        marginLeft:10
    },
    inputLabel:{
        fontSize:20
    },
    input:{
        backgroundColor:"white",
        flex:1,
        borderRadius:10,
        marginLeft:10,
        paddingLeft:5
    },
    loginButton:{
        backgroundColor:"blue",
        marginTop:20,
        marginLeft:70,
        marginRight:70,
        alignItems:'center',
        justifyContent:"center",
        padding:5,
        borderRadius:10
    }
})