import React, { useState } from "react";
import {db} from '../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import "./allStudents.css"



export default function Sessions(){
    const [sessions, setSessions] = useState([]);
    const [addNewDisplay, setAddNewDisplay] = useState(false);
    const [addNewSessionPeriod, setAddNewSessionPeriod] = useState("");
    const [error, setError] = useState("");

    const [dialogShow, setDialogShow] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");
    const [dialogType, setDialogType] = useState(true);

    const [deleteSessionDialogShow, setDeleteSessionDialogShow] = useState(false);
    const [deleteSessionPeriod, setDeleteSessionPeriod] = useState("");

    
    
    const GetData = () =>{
        let s = db.collection('Sessions');
        let data = useCollectionData(s,{idField:"id"})[0];
        return {data}
    }
    let {data} = GetData();

    if (data && data !== sessions){
        setSessions(data)
    }

    //console.log(sessions)


    const getAllSessions = () =>{
       let data = sessions.map((s) =>
        <div className='studentsNameListMainDiv' key={s.sessionPeriod}>
        <div 
            className="studentsNameList">
            <div className='studentsDetailsSpan'>
                <span>{s.sessionPeriod}</span>
                <div >
                    <button 
                        className="btn btn-danger" 
                        onClick={()=> {
                            setDeleteSessionPeriod(s.sessionPeriod);
                            setDeleteSessionDialogShow(true)
                        }}>Delete</button>
                </div>
            </div>
        </div>
        </div>
       )
       return data;
    }

    const saveNewSession = () =>{
        if (addNewSessionPeriod.length === 9 
            && addNewSessionPeriod.charAt(4) === "-" 
            && Number(addNewSessionPeriod.substring(0,4))+1 === Number(addNewSessionPeriod.substring(5,9))){
            db.collection("Sessions").doc(addNewSessionPeriod).set({
                'sessionPeriod': addNewSessionPeriod
            }).then((e)=>{
                setDialogTitle("Success");
                setDialogContent('Successfully Saved')
                setDialogType(true);
                setDialogShow(true);

                setAddNewDisplay(false);
                setError("");
                setAddNewSessionPeriod("");
            }).catch(() =>{
                setDialogTitle("Failed");
                setDialogContent('Some Error Occured')
                setDialogType(false);
                setDialogShow(true)
            });

        }
        else{
            setError("Session Period is not formatted correctly")
        }
    }

    const deleteSession = (s) =>{
        setDeleteSessionDialogShow(false);
        db.collection("Sessions").doc(deleteSessionPeriod).delete().then(() =>{
            setDialogTitle("Success");
            setDialogContent("Successfully deleted " + deleteSessionPeriod + " session period");
            setDialogType(true);
            setDeleteSessionPeriod("");
            setDialogShow(true);
        }).catch((e) =>{
            console.log(e)
            setDialogTitle("Failed");
            setDialogContent("Try Again");
            setDialogType(false);
            setDeleteSessionPeriod("");
            setDialogShow(true);
        })
        //console.log(s)
    }

    return (
        <div>
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
                
                <Button onClick={() => {
                    setDialogShow(false);
                    setDialogTitle("");
                    setDialogContent("");
                    }} 
                        color="primary" autoFocus>
                    Close
                </Button>

                </DialogActions>
            </Dialog>

            {/* Delete Session Dialog  */}
            <Dialog 
                open={deleteSessionDialogShow} 
                onClose={
                    () => {
                        setDeleteSessionDialogShow(false);
                        setDeleteSessionPeriod("");
                        }}>
                <DialogTitle style={{color:"red"}}>Alert!</DialogTitle> 
                <DialogContent>
                <DialogContentText>
                    Are You Sure to Delete {deleteSessionPeriod} Session Period?
                </DialogContentText>
                </DialogContent>
                <DialogActions>

                <Button onClick={() => {
                        deleteSession(deleteSessionPeriod)
                    }} 
                        color="primary">
                    Yes
                </Button>
                
                <Button onClick={() => {
                        setDeleteSessionDialogShow(false);
                        setDeleteSessionPeriod("");
                    }} 
                        color="primary" autoFocus>
                    No
                </Button>

                </DialogActions>
            </Dialog>



            <h3 style={{fontFamily:'inherit'}}>List of All Sessions:</h3>
            {getAllSessions()}
            <div className='studentsNameListMainDiv'>
                <div 
                    className="studentsNameList" 
                    onClick={() => {
                        if (addNewDisplay){
                            setAddNewDisplay(false);
                            setError("");
                            setAddNewSessionPeriod("");
                        }
                        else{
                            setAddNewDisplay(true)
                        }
                    }}>
                    <div className='studentsDetailsSpan' style={{display:'contents'}}>Add New +</div>
                </div>
                {addNewDisplay &&
                    <div className='studentsNameListEditDiv'>
                            <label className='studentsDetailEditLabel'>Session-Period:</label>
                            <input 
                                className='studentsDetailEditInput' 
                                value={addNewSessionPeriod}
                                onChange={(e) => setAddNewSessionPeriod(e.target.value)}
                                onFocus={() => setError("")}
                                type='text'/>
                            {error && <h5 style={{color:'red'}}>{error}</h5>}
                            <Button onClick={saveNewSession} style={{backgroundColor:'blue'}} >Save</Button>
                    </div>
                }
            </div>

        </div>
    )
}