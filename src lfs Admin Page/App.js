import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';  

import { useAuthState } from 'react-firebase-hooks/auth';

import {useState} from 'react';
import {BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom';
import { auth,firebase} from './firebase';
import DashboardMain from './Dashboard/mainDashboard';
import AppDownload from './DownloadApp';
import { useHistory } from 'react-router-dom';


export default function App(){
    const [user] = useAuthState(auth);
    let history = useHistory();
    function checkUserLoggedIn(){
        if (user){
            return <Redirect to='/dashboard'></Redirect>
        }
        else{
            return <Redirect to='/login'></Redirect>
        }
    }
    return(
        <div>
            <Router>
                <Switch>
                    <Route exact path='/'>
                        {checkUserLoggedIn()}
                    </Route>
                    <Route exact path="/login" render={(props) => <Login {...props}/>}/>
                    <Route exact path="/logout" render={(props) => <Logout {...props}/>}/>
                    <Route path="/dashboard" render={(props) => <DashboardMain/>}/>
                    {/* <Route path="/app" exact={true}><AppDownload/></Route> */}
                    <Route path='*' exact={true}>
                        <PageNotFound/>
                    </Route>
                </Switch>
            </Router>
            {/* {user ? <HomePage auth={auth}/> : <Login/>} */}
        </div>
    )
}

function Login(props){
    document.title = 'Login';
    let history = useHistory();
    const [user] = useAuthState(auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    function mainLoginClicked(e){
        e.preventDefault();
        // console.log(email);
        // console.log(password);
        setLoginInProgress(true);
        setSuccessMessage('');
        setErrorMessage('');
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            //var user = userCredential.user;
            setLoginInProgress(false);
            // ...
        })
        .catch((error) => {
            setLoginInProgress(false)
            //var errorCode = error.code;
            var errorMessage = error.message;
            setErrorMessage(errorMessage)
        });
    }
    function messageDisplay(){
        if (props.location.state){
            console.log(props.location.state)
            if (props.location.state.successMessageDisplay){
                return <h6
                    style={{
                        textAlign:'center',
                        color:'green'}}>{props.location.state.displayMessage}
                </h6>
            }
            else if (props.location.state.errorMessageDisplay){
                return <h6
                    style={{
                        textAlign:'center',
                        color:'red',
                        textDecoration:'underline'}}>{props.location.state.displayMessage}
                </h6>
            }
        }
    }

    if (!user){
        return(
            <div>
                <div className="container" style={{width:'100%'}}>
                    <div className="row">
                        <div className="col-md-6 mx-auto py-4 px-0">
                            <div className="card p-0">
                                <div className="card-title text-center">
                                    <h5 className="mt-5 welcomeHead">Hey, Welcome</h5>
                                    <small className="para">Login to Continue....</small>
                                </div>
                                {successMessage && 
                                    <h6 style={{
                                        textAlign:'center',
                                        color:'Green'
                                    }}>{successMessage}</h6>}
                                {errorMessage && 
                                    <h6 style={{
                                        textAlign:'center',
                                        color:'red',
                                        textDecoration:'underline'
                                    }}>{errorMessage}</h6>}
                                {messageDisplay()}
                                <form className="signup" onSubmit={mainLoginClicked}>
                                    <div className="form-group">
                                        {email && <span>Email:</span>}
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Email"
                                            name='username'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required={true}/>
                                    </div><br/>
                                    <div className="form-group">
                                        {password && <span>Password:</span>}
                                        <input 
                                            type="Password" 
                                            className="form-control" 
                                            name='password'
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required={true} />
                                    </div><br/>
                                    <button
                                        type="Submit" 
                                        className="btnLogin btn btn-primary"
                                        style={{marginBottom:'30px'}}
                                        >
                                        {!loginInProgress ? 
                                            <span>Login</span>
                                            :
                                            <span>Wait.....&nbsp;&nbsp;
                                                <div style={{height:'22px',width:'22px'}} class="spinner-border text-primary" role="status">
                                                    <span class="sr-only"></span>
                                                </div>
                                            </span>
                                        }
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <Redirect to='/dashboard'></Redirect>
        )
    }
}

function Logout(props){
    auth.signOut();
    return(
        <Redirect to='/login'/>
    )
}

function PageNotFound(){
    return(
        <div>
            <h1>404</h1>
            <h2>
                Page Not Found
            </h2>
        </div>
    )
}
