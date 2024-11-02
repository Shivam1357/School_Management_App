import React, { useState } from "react";
import {auth,db} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import "./home.css";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { Checkbox } from "@material-ui/core";
import { Alert } from "react-bootstrap";


const Notifications = (props) => {
    const [user] = useAuthState(auth);

    let senderName = "";

    db.collection("AllTeachers").doc("1000").get().then((doc) =>{
        if (doc.exists){
            senderName = doc.data().name;
        }
    });
    


    const [sendANewNotificationActive, setSendANewNotificationActive] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [error, setError] = useState("");

    const [dialogShow, setDialogShow] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");
    const [dialogType, setDialogType] = useState(true);
    const [dialogButtonShow, setDialogButtonShow] = useState(true);

    const [allClass, setAllClass] = useState([]);
    const [allClassT, setAllClassT] = useState([]);

    const [messageSendAll, setMessageSendAll] = useState(true);
    const [chooseClassesDialogActive, setChooseClassesDialogActive] = useState(false);
    const [messageSendCustomList, setMessageSendCustomList] = useState([]);

    const [dialogBoxError, setDialogBoxError] = useState("");


    const GetAllClass = () =>{
        let a = db.collection('AllClass');
        let data2 = useCollectionData(a,{idField:'id'})[0];
        return {data2}
    }
    let {data2} = GetAllClass();
    if (data2 && data2 !== allClassT){   
        let a = [];
        for (var i = 0 ; data2.length >i;i++){
            a.push([data2[i]["class"] + "-" + data2[i]["section"],data2[i]["classCode"]]) 
        }
        setAllClassT(data2)
        setAllClass(a)
    }
    //console.log(allClass)

    //console.log(messageSendCustomList)
    const getAllClassCheckbox = () =>{
        let data = allClass.map((c) =>
            <span key={c[1]}>
                <Checkbox
                    onChange={(e) => {
                        var t = messageSendCustomList;
                        if (t.indexOf(c[1]) === -1){
                            t.push(c[1])
                        }
                        else{
                            t.splice(t.indexOf(c[1]),1)
                        }
                        setMessageSendCustomList(t)
                        //console.log(messageSendCustomList)
                     }}/>
                <span>{c[0]}</span><br/>
            </span>
        )
        return data
    }
    const getClassName = (c) =>{
        for (var e = 0 ; allClass.length > e ; e++){
            if (allClass[e][1] === c){
                return allClass[e][0]
            }
        }
    }



    const sendNotifications = () =>{
        if (notificationMessage){
            var milliseconds = Date.now();
            var sendSuccess = 0;
            let classesSend1 = [];
            setDialogButtonShow(false);
            setDialogTitle("Sending....");
            setDialogType(true);
            setDialogShow(true);
            if (messageSendAll){
                for (var i = 0 ; allClass.length > i ; i++){
                    var j = allClass[i][1]
                    //console.log(j);
                    sendSuccess++;
                    classesSend1.push(String(j))
                    db.collection("Notifications").doc("Students").collection(String(j)).doc(String(milliseconds)).set({
                        "message":notificationMessage,
                        "sender":senderName,
                        "timeSent":Number(milliseconds),
                        "senderUserUid":user.uid,
                        "id":Math.floor((Math.random() * 9999) + 1000)
                    })
                    .then(() => {
                        setDialogContent("Sending " + String(sendSuccess) + "/" + String(allClass.length));
                    })
                    .catch(() =>{
                        
                    })
                }
            }
            else{
                for (var o = 0 ; messageSendCustomList.length > o ; o++){
                    var m = messageSendCustomList[o]
                    classesSend1.push(String(m))
                    //console.log(m)
                    db.collection("Notifications").doc("Students").collection(String(m)).doc(String(milliseconds)).set({
                        "message":notificationMessage,
                        "sender":senderName,
                        "timeSent":Number(milliseconds),
                        "senderUserUid":user.uid,
                        "id":Math.floor((Math.random() * 9999) + 1000)
                    })
                    .then(() => {
                        setDialogContent("Sending " + String(sendSuccess) + "/" + String(messageSendCustomList.length))
                    })
                    .catch(() =>{
                        
                    })
                }
            }
            //console.log(classesSend1)
            db.collection("AllTeachers").doc(String(1000)).collection("Notifications").doc(String(milliseconds)).set({
                "message":notificationMessage,
                "timeSent":Number(milliseconds),
                "classesSend":classesSend1
            })
            .then(() =>{
                setDialogButtonShow(true);
                setDialogTitle("Success");
                setDialogContent("Successfully Sent");
                setNotificationMessage("");
                setSendANewNotificationActive(false);
                setMessageSendAll(true);
                setMessageSendCustomList([]);
            })
            //console.log("save")

        }
        else{
            setError("Type a Message to Send")
        }
    }

    const [pastNotifications, setPastNotifications] = useState([]);
    const [pastNotificationLimit, setPastNotificationLimit] = useState(2);
    const [deleteNotificationDialogShow, setDeleteNotificationDialogShow] = useState(false);
    const [deleteNotificationId, setDeleteNotificationId] = useState("");
    const [deleteNotificationClassesSend, setDeleteNotificationClassesSend] = useState([]);

    
    const GetPastNotifications = () =>{
        let a = db 
            .collection('AllTeachers')
            .doc('1000')
            .collection('Notifications')
            .orderBy("timeSent",'desc')
            .limit(pastNotificationLimit);
        let data3 = useCollectionData(a,{idField:'id'})[0];
        return {data3}
    }
    let {data3} = GetPastNotifications();
    if (data3 && data3 !== pastNotifications){   
        setPastNotifications(data3)
    }
    //console.log(pastNotifications)

    function getTime(ms){
        var t = new Date(Number(ms)).toLocaleString();
        return t
    }



    const GetPastNotificationsDiv = () =>{
        let q = pastNotifications.map((n) =>
            <div key={n.timeSent}>
                <Alert 
                    variant="secondary"
                    onClose={() => {
                        setDeleteNotificationId(n.timeSent);
                        setDeleteNotificationClassesSend(n.classesSend);
                        setDeleteNotificationDialogShow(true);
                    }}  
                    dismissible>
                    <Alert.Heading>{getTime(n.timeSent)}</Alert.Heading>
                    <p>
                        {n.message}
                    </p>
                    {n.classesSend.map((c) => 
                            <span>{getClassName(c)}, </span>
                        )}
                </Alert>
            </div>
        )
        return q
    }

    const DeleteNotification = () =>{
        setDeleteNotificationDialogShow(false);
        var deletedCount = 0;
        setDialogTitle("Deleting...");
        setDialogContent("Pulling back " + String(deletedCount) + "/" + String(deleteNotificationClassesSend.length));
        setDialogType(true);
        setDialogShow(true)
        for (var g = 0 ; deleteNotificationClassesSend.length > g ; g++){
            db
            .collection("Notifications").doc("Students")
            .collection(String(deleteNotificationClassesSend[g])).doc(String(deleteNotificationId))
            .delete()
            .then(() => {
                deletedCount = deletedCount + 1;
                setDialogContent("Deleting " + String(deletedCount) + "/" + String(deleteNotificationClassesSend.length));
            })
            .catch((e) =>{
                setDialogTitle("Failed");
                setDialogContent("Some Error Occured");
            })
            //console.log(deleteNotificationClassesSend[g])
        }
        db
        .collection("AllTeachers").doc("1000")
        .collection("Notifications").doc(String(deleteNotificationId))
        .delete()
        .then(() =>{
            setDialogTitle("Success");
            setDialogContent("Successfully removed targeted notification");
            setDeleteNotificationClassesSend([]);
            setDeleteNotificationId("");
        })
        .catch((e) =>{
            setDialogTitle("Failed");
            setDialogContent("Some Error Occured");
        })
        // console.log(deleteNotificationId);
        //console.log(deleteNotificationClassesSend);
        
    }



    return (
        <div>
            {/* Choose Class Dialog Box */}
            <Dialog 
                open={chooseClassesDialogActive} 
                onClose={
                    () => {
                        setChooseClassesDialogActive(false);
                        setMessageSendAll(true)
                        }}>
                <DialogTitle style={{color:'black'}}>Choose Classes to Send Messages</DialogTitle>
                <DialogContent>
                <DialogContentText>
                        <span style={{color:'red'}}>{dialogBoxError}</span>
                        {getAllClassCheckbox()}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {
                            if (messageSendCustomList.length === 0){
                                setDialogBoxError("Choose Classes")
                            }
                            else{
                                setMessageSendAll(false);
                                setChooseClassesDialogActive(false);
                            }
                        }} 
                        color="primary">
                    Done
                </Button>    
                <Button onClick={() => {
                    setChooseClassesDialogActive(false);
                    setMessageSendAll(true)
                    }} 
                        color="primary" autoFocus>
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>

            {/* Normal Dialog Box */}
            <Dialog 
                open={dialogShow} 
                onClose={
                    () => {
                        setDialogShow(false);
                        setDialogTitle("");
                        setDialogContent("");
                        }}>
                {dialogType ?
                     <DialogTitle style={{color:"green"}}>{dialogTitle}</DialogTitle> 
                     :
                     <DialogTitle style={{color:"red"}}>{dialogTitle}</DialogTitle>  } 
                <DialogContent>
                <DialogContentText>
                    {dialogContent}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                {dialogButtonShow &&
                    <Button onClick={() => {
                        setDialogShow(false);
                        setDialogTitle("");
                        setDialogContent("");
                        }} 
                            color="primary" autoFocus>
                        OK
                    </Button>
                }

                </DialogActions>
            </Dialog>

            {/* Delete Notification Dialog Box */}
            <Dialog 
                open={deleteNotificationDialogShow} 
                onClose={
                    () => {
                        setDeleteNotificationDialogShow(false);
                        setDeleteNotificationClassesSend([]);
                        setDeleteNotificationId("");
                        }}>
                <DialogTitle style={{color:"red"}}>Alert!</DialogTitle> 
                <DialogContent>
                <DialogContentText>
                    Are you sure to Pull back this send notification ?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={DeleteNotification} 
                        color="primary">
                    Yes
                </Button> 
                <Button onClick={() => {
                    setDeleteNotificationDialogShow(false);
                    setDeleteNotificationClassesSend([]);
                    setDeleteNotificationId("");
                    }} 
                        color="primary" autoFocus>
                    No
                </Button>

                </DialogActions>
            </Dialog>


            <button 
                className="btn btn-info"
                onClick={() => {setSendANewNotificationActive(true);setPastNotificationLimit(2)}}>
                    Send a New Notification
                </button>
            {sendANewNotificationActive ?
                <div>
                    <textarea 
                        onFocus={() => setError("")}
                        className="notificationMessageTextArea"
                        placeholder="Type a Message...."
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)} /><br/>
                    <Checkbox  
                        checked={messageSendAll} 
                        onChange={() => {
                            if (!messageSendAll){
                                setMessageSendAll(true);
                                setMessageSendCustomList([]);
                            }}}/>
                    <span>Send All</span> <br/>
                    <span style={{marginLeft:'12px'}}> Or </span><br/>
                    <Checkbox 
                        checked={!messageSendAll}
                        onChange={() => {
                            if (messageSendAll){
                                setDialogBoxError("");
                                setMessageSendCustomList([]);
                                setMessageSendAll(false);
                                setChooseClassesDialogActive(true)}
                            else{
                                setMessageSendCustomList([]);
                                setChooseClassesDialogActive(true);
                                setDialogBoxError("");
                            }
                            }} />
                    {messageSendCustomList.length !== 0 
                    ?
                        messageSendCustomList.map((c) =>
                            <span>{getClassName(c)} , </span>
                        )
                        
                    :
                    <span>Custom</span>
                    }
                    <br/>
                    {/* <button 
                        className="btn btn-dark" 
                        onClick={() => setChooseClassesDialogActive(true)} >
                            Custom
                        </button> */}
                    {/* {getAllClassCheckbox()} */}
                    {error && <span style={{color:'red',marginLeft:'12px'}}>{error}</span>}
                    <div>
                        <button 
                            onClick={sendNotifications}
                            className="btn btn-success"
                            style={{margin:'5px'}}>
                                Send
                            </button>
                        <button 
                            onClick={()=> setSendANewNotificationActive(false)}
                            className="btn btn-danger"
                            style={{margin:'5px'}}>
                                Discard
                            </button>
                    </div>
                </div>
            :
            <div style={{marginTop:'20px'}}>
                <h4 style={{fontFamily:'inherit'}}>Past Notifications:</h4>
                {GetPastNotificationsDiv()}
                <button 
                    className="btn btn-dark"
                    onClick={()=> {
                        var j = pastNotificationLimit;
                        setPastNotificationLimit(j + 3)
                    }} >Show More</button>
            </div>
            }
        </div>
    )
}

export default Notifications