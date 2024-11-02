import {BrowserRouter as Route,Switch,Redirect,Link} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth,firebase,db} from './firebase';

import 'w3-css/w3.css';
import MaterialIcon from 'react-google-material-icons';
import { useState } from 'react';


import HomePage from './userPages/homepage';
import Goals from './userPages/goals';
import Diary from './userPages/diary';
import Profile from './userPages/profile';
import PersonalNote from './userPages/personalNote';
import DecideActions from './userPages/decideActions';
import { Dropdown } from 'bootstrap';


export default function User(props){
    document.title = 'My Goals'
    const [user] = useAuthState(auth);;
    let [navOpen,setNavOpen] = useState(false);


    if (user){
        //const {displayName,uid,photoURL} = auth.currentUser;
        document.body.style.backgroundColor = "white";
        
        let navStyle = () =>{
            if (navOpen){
                return{
                    display:'block'
                }
            }
            else{
                return{
                    display:'none'
                }
            }
        }
        return(
            <div>
                {/* Navbar (sit on top)  */}
                <div className="w3-top">
                    <div className="w3-bar w3-white w3-card" id="myNavbar">
                        <span>Logo</span>
                        {/* <!-- Right-sided navbar links --> */}
                        <div className="w3-right w3-hide-small">
                            <Link 
                                to='/user' 
                                className="w3-bar-item w3-button">
                                Home
                            </Link>
                            {/* <Link 
                                to='/user/goals' 
                                className="w3-bar-item w3-button">
                                My Goals
                            </Link> */}
                            <Link 
                                to='/user/diary' 
                                className="w3-bar-item w3-button">
                                My Diary
                            </Link>
                            <Link 
                                to='/user/decideActions' 
                                className="w3-bar-item w3-button">
                                Decide Actions
                            </Link>
                            {/* <Link 
                                to='/user/personalNote' 
                                className="w3-bar-item w3-button">
                                Personal Notes
                            </Link> */}
                            {/* <Link 
                                to='/user/profile' 
                                className="w3-bar-item w3-button">
                                Profile
                            </Link> */}
                            <Link 
                                to='/logout' 
                                className="w3-bar-item w3-button">
                                Logout
                            </Link>
                        </div>
                        {/* <!-- Hide right-floated links on small screens and replace them with a menu icon --> */}

                        <a href="#" onClick={() => setNavOpen(true)} className="w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium"  >
                        <MaterialIcon icon="menu" size={25}/>
                        </a>
                    </div>
                    {/* <!-- Sidebar on small screens when clicking the menu icon --> */}

                    <nav className="w3-sidebar w3-bar-block w3-black w3-card w3-animate-left w3-hide-medium w3-hide-large" style={navStyle()}>
                        <a href='#' onClick={() => setNavOpen(false)} className="w3-bar-item w3-button w3-large w3-padding-16">Close ×</a>
                        <Link 
                            to='/user' 
                            className="w3-bar-item w3-button" 
                            onClick={() => setNavOpen(false)}>
                            Home
                        </Link>
                        {/* <Link 
                            to='/user/goals' 
                            className="w3-bar-item w3-button" 
                            onClick={() => setNavOpen(false)}>
                            My Goals
                        </Link> */}
                        <Link 
                            to='/user/diary' 
                            className="w3-bar-item w3-button" 
                            onClick={() => setNavOpen(false)}>
                            My Diary
                        </Link>
                        <Link 
                            to='/user/decideActions' 
                            className="w3-bar-item w3-button" 
                            onClick={() => setNavOpen(false)}>
                            Decide Actions
                        </Link>
                        {/* <Link 
                            to='/user/personalNote' 
                            className="w3-bar-item w3-button" 
                            onClick={() => setNavOpen(false)}>
                            Personal Notes about People
                        </Link>
                        <Link 
                            to='/user/profile' 
                            className="w3-bar-item w3-button">
                            Profile
                        </Link> */}
                        <Link 
                            to='/logout' 
                            className="w3-bar-item w3-button">
                            Logout
                        </Link>
                    </nav>
                </div>
                <div style={{margin:'20px','marginTop':'55px'}}>
                    <Switch>
                        <Route exact path='/user'>
                            <HomePage/>
                        </Route>
                        {/* <Route exact path='/user/goals'>
                            <Goals/>
                        </Route> */}
                        <Route exact path='/user/diary'>
                            <Diary/>
                        </Route>
                        <Route exact path='/user/decideActions'>
                            <DecideActions/>
                        </Route>
                        {/* <Route exact path='/user/profile'>
                            <Profile/>
                        </Route>
                        <Route exact path='/user/personalNote'>
                            <PersonalNote/>
                        </Route> */}
                    </Switch>
                </div>
            
                {/* <!-- Footer --> */}
                <div>
                <footer 
                    className="w3-center footer" 
                    style={{
                        backgroundColor:'#020b27',
                        paddingBottom:'1px',
                        paddingTop:'10px',
                        marginTop:'10px',
                        position:'absolute',
                        bottom:'-110px',
                        width:'100%',
                        height:'109px' }}>
                <div className="w3-section">
                    <div>
                        <ul className='bottomNavUl' >

                        </ul>

                    </div>
                    <span style={{margin:'10px'}}>
                        <span style={{color:'#7e7d82'}}>Designed,Developed and Maintained by Shivam Jaiswal</span><br/>
                        <span className='copy' style={{color:'#7e7d82'}}>&copy;Copyright 2021 All Rights Reserved.</span>
                    </span>
                </div>
                </footer>
                </div>
            </div>
        )
    }
    else{
        return(
            <Redirect to='/login'/>
        )
    }
}