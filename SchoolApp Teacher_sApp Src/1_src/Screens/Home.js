import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, BackHandler, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AlertDialog from "../components/AlertDialog";
import MainPageDisplay from "../components/Home/MainPageDisplay";
import TopBar from "../components/TopBar";
import { auth } from "../firebase";
import { useRoute } from '@react-navigation/native';



const Home = ({navigation}) => {
    const {currentUser} = auth;
    onAuthStateChanged(auth,user =>{
        if (user == null){
            navigation.navigate("Login")
        }
    })
    const route = useRoute();
    //console. log(route. name);
    const [testD, setTestD] = useState(route.name);
      
    useEffect(() => {
      setTestD(JSON.stringify( route.name))
    }, []);
    
    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp() ;
            return true;
        };
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
           backAction
        );
        return () => backHandler.remove();
      }, []);

    const [signOutClicked, setsignOutClicked] = useState(false);

    function SignOut(){
        setsignOutClicked(false);
        signOut(auth).then(() =>{
            navigation.navigate("Login")
        }).catch(() =>{

        })
    }
    return (
        <View style={styles.container}>            
            <View style={styles.mainArea}>
                <TopBar 
                    topText="HomePage"
                    firstIconName={"user"}
                    firstIconClicked={() => {navigation.navigate("Profile")}}
                    secondIconName={"sign-out"}
                    secondIconClicked={() => setsignOutClicked(true)} />
                <MainPageDisplay navigation={navigation}/>
            </View>
            {signOutClicked &&
            <AlertDialog
                title="Alert!"
                message="Are you sure to LogOut?"
                positiveText="Yes"
                positiveAction={() => SignOut()}
                negativeText="No"
                negativeAction={() => setsignOutClicked(false)}  />
            }
        </View>
    )
}

export default Home;

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
        flex:1
    }
})
