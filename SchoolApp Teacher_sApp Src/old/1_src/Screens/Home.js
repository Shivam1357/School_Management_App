import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, BackHandler, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AlertDialog from "../components/AlertDialog";
import MainPageDisplay from "../components/Home/MainPageDisplay";
import TopBar from "../components/TopBar";
import { auth } from "../firebase";
import { useNavigationState } from '@react-navigation/native'  


const Home = ({navigation}) => {
    const {currentUser} = auth;
    if (currentUser){
        //console.log(currentUser.uid)
    }
    else{
        navigation.navigate("Login")
    }
      

    // const routes = useNavigationState(state => state.routes)
    // const currentRoute = routes[routes.length -1].name
    // console.log('currentRoute: ',currentRoute)
    // //const backHandler = BackHandler.addEventListener('hardwareBackPress', BackHandler.exitApp());
    // useEffect(() => {
    //     const backAction = () => {

    //     //   Alert.alert('Hold on!', 'Are you sure you want to go back?', [
    //     //     {
    //     //       text: 'Cancel',
    //     //       onPress: () => null,
    //     //       style: 'cancel',
    //     //     },
    //     //     { text: 'YES', onPress: () => BackHandler.exitApp() },
    //     //   ]);
    //         if (currentRoute == "Home"){
    //             BackHandler.exitApp()
    //         }
    //         return true;
    //     };
    
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
    //     return () => backHandler.remove();
    //   }, []);

    //console.log(auth);
    const [signOutClicked, setsignOutClicked] = useState(false);

    
    function SignOut(){
        setsignOutClicked(false);
        navigation.navigate("Login")
        // signOut(auth).then(() =>{
        //     navigation.navigate("Login")
        // }).catch(() =>{

        // })
    }
    return (
        <View style={styles.container}>
            {/* <Text>Hello</Text> */}
            
            
            <View style={styles.mainArea}>
                <TopBar 
                    topText="HomePage"
                    firstIconName={"user"}
                    firstIconClicked={() => {navigation.navigate("Profile")}}
                    secondIconName={"sign-out"}
                    secondIconClicked={() => setsignOutClicked(true)} />
                <MainPageDisplay navigation={navigation}/>
                {/* <View style={styles.mainPageDisplay}>
                    <Text>Welcome</Text>
                </View> */}
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
