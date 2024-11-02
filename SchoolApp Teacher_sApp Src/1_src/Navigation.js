import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Screens/Login";
import Home from "./Screens/Home";
import Profile from "./Screens/Profile";
import SendNotifications from "./Screens/SendNotifications";
import PastNotifications from "./Screens/PastNotifications";
import IconDisplay from "./Screens/IconDisplay";


const Navigation = (props) => {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={IconDisplay}>
                <Stack.Screen 
                    name="IconDisplay"
                    component={IconDisplay}
                    options={{
                        headerShown:false
                    }}/>
                <Stack.Screen 
                    name="Login"
                    component={Login}
                    options={{
                        headerShown:false
                    }}/>
                <Stack.Screen 
                    name="Home"
                    component={Home}
                    options={{
                        headerShown:false
                    }}/>
                <Stack.Screen 
                    name="Profile"
                    component={Profile}
                    options={{
                        headerShown:false
                    }}/>
                <Stack.Screen 
                    name="SendNotification"
                    component={SendNotifications}
                    options={{
                        headerShown:false
                    }}/>
                <Stack.Screen 
                    name="PastNotifications"
                    component={PastNotifications}
                    options={{
                        headerShown:false
                    }}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
