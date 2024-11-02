import { useState } from "react";
import {Link ,BrowserRouter as Router,Route,Switch,useRouteMatch,Redirect} from 'react-router-dom';
import 'w3-css/w3.css';
import MaterialIcon from 'react-google-material-icons';
import './MainDashboard.css';

import { auth,firebase} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import allStudents from "./allStudents";
import AllStudents from "./allStudents";
import AllTeachers from "./allTeachers";
import Sessions from "./sessions";
import AllClass from "./allClass";
import Home from "./home";


const DashboardMain = () => {
    document.title = 'Home';
    const [user] = useAuthState(auth);
    let {url,path} = useRouteMatch();
    document.body.style.backgroundColor = "white";
    let [navOpen,setNavOpen] = useState(false);

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

    
    if (user){
    return ( 
        <div>
            <div className="w3-top">
                <div className="w3-bar w3-white w3-card" id="myNavbar">
                    <a href="#" onClick={() => setNavOpen(true)} className="w3-bar-item w3-button w3-left"  >
                        <MaterialIcon icon="menu" size={25}/>
                    </a>
                    <a href="#home" className="w3-bar-item w3-button w3-wide">LOGO</a>
                    {/* <!-- Right-sided navbar links --> */}
                    <div className="w3-right w3-hide-small">
                        {/* links */}
                        <Link to={`${url}`} className="w3-bar-item w3-button">Home</Link>
                        <Link to='/logout' className="w3-bar-item w3-button">Logout</Link>
                    </div>
                    
                    {/* <!-- Hide right-floated links on small screens and replace them with a menu icon --> */}
                </div>
                {/* <!-- Sidebar on small screens when clicking the menu icon --> */}


                <nav className="w3-sidebar w3-bar-block w3-black w3-card w3-animate-left" style={navStyle()}>
                    <a href='#' onClick={() => setNavOpen(false)} className="w3-bar-item w3-button w3-large w3-padding-16">Close ×</a>
                    <Link to={`${url}`} className="w3-bar-item w3-button" onClick={() => setNavOpen(false)}>Home</Link>
                    <Link to={`${url}/allStudents`} className="w3-bar-item w3-button" onClick={() => setNavOpen(false)}>All Students List</Link>
                    <Link to={`${url}/classes`} className="w3-bar-item w3-button" onClick={() => setNavOpen(false)}>All Classes</Link>
                    <Link to={`${url}/allTeachers`} className="w3-bar-item w3-button" onClick={() => setNavOpen(false)}>All Teachers</Link>
                    <Link to={`${url}/sessions`} className="w3-bar-item w3-button" onClick={() => setNavOpen(false)}>Sessions</Link>
                    <Link to="/logout" className="w3-bar-item w3-button" onClick={() => setNavOpen(false)}>Logout</Link>

                    <h6 style={{
                        fontFamily:'inherit',
                        color:'#a3a7a7',
                        margin:'40px 10px'
                    }}>Designed and Developed by Shivam Jaiswal</h6>    
                </nav>
            </div>
            <div className='bodyMainDisplay' style={{margin:'60px 10px 10px 10px'}}>
                <Switch>
                    <Route exact path={`${path}/`}>
                        <Home/>
                    </Route>
                    <Route exact path={`${path}/allStudents`}>
                        <AllStudents/>
                    </Route>
                    <Route exact path={`${path}/allTeachers`}>
                        <AllTeachers/>
                    </Route>
                    <Route exact path={`${path}/sessions`}>
                        <Sessions/>
                    </Route>
                    <Route exact path={`${path}/classes`}>
                        <AllClass/>
                    </Route>
                </Switch>
            </div>

        </div>
     );
    }
    else{
        return(
            <Redirect to='/login'></Redirect>
        )
    }
}

export default DashboardMain;