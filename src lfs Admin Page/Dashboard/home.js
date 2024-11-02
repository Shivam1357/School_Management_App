import React from "react";
import Notifications from "./notifications";



const Home = (props) => {

    return (
        <div>
            <div>
                <Greeting/>
            </div>
            <hr/>
            <div>
                <Notifications/>
            </div>
            <hr/>
        </div>
    )
}
function Greeting(){

    
    return(
        <div>
            <h2 style={{fontFamily:"inherit"}}>Welcome, Admin </h2>
        </div>
    )
}


export default Home;