import React, { useState } from "react";
import { auth,firebase,db} from '../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import "./allStudents.css"




export default function AllTeachers(){
    document.title = "Teachers List"; 

    const [dialogShow, setDialogShow] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");
    const [dialogType, setDialogType] = useState(true);

    const [deleteTeacherDialogShow, setDeleteTeacherDialogShow] = useState(false);

    const [allTeachers, setAllTeachers] = useState([]);

    const [tName, setTName] = useState("");
    const [tUserUid, setTUserUid] = useState("");
    const [tUniqueCode, setTUniqueCode] = useState("");

    const [error, setError] = useState("");
    const [editDivDisplay, seteditDivDisplay] = useState("");

    const [addNewTeacherActive, setAddNewTeacherActive] = useState(false);
     

    const GetData = () =>{
        let q = db.collection('AllTeachers');
        let all = useCollectionData(q,{idField:'id'})[0];
        return {all};
    }
    let {all} = GetData();
    
    if (all && all !== allTeachers){
        setAllTeachers(all)
    }
    console.log(allTeachers);

    const getAllTeachers = () =>{
        let data = allTeachers.map((teacher) =>
        <div className='studentsNameListMainDiv' key={teacher.uniqueCode}>
        <div 
            className="studentsNameList" 
            onClick={() => {
                if (editDivDisplay !== teacher.uniqueCode){
                    seteditDivDisplay(teacher.uniqueCode);
                    setError("");
                    setAddNewTeacherActive(false);
                    setTName("");
                    setTUniqueCode("");
                    setTUserUid("");
                }
                else{
                    seteditDivDisplay(null);
                    setTName("");
                    setTUniqueCode("");
                    setTUserUid("");
                }
                }}>
            <div className='studentsDetailsSpan index'>{allTeachers.indexOf(teacher)+1}</div>
            <div className='studentsDetailsSpan admNo'>{teacher.uniqueCode}</div>
            <div className='studentsDetailsSpan admNo' style={{width:'auto'}}>{teacher.name}</div>
        </div>
        {editDivDisplay === teacher.uniqueCode &&
        <div className='studentsNameListEditDiv'>
            {tUniqueCode === "" ? setTUniqueCode(teacher.uniqueCode) : ""}
            {tName === "" ? setTName(teacher.name) : ""}
            {tUserUid === "" ? setTUserUid(teacher.userUid) : ""}

            <label className='studentsDetailEditLabel'>Name:</label>
            <input 
                className='studentsDetailEditInput' 
                value={tName} 
                onChange={(e) => setTName(e.target.value)}
                type='text' />
            <label className='studentsDetailEditLabel'>User Uid:</label>
            <input 
                className='studentsDetailEditInput' 
                value={tUserUid} 
                onChange={(e) => setTUserUid(e.target.value)}
                type='text'/>
            <label className='studentsDetailEditLabel'>Unique Code:</label>
            <input 
                className='studentsDetailEditInput' 
                value={tUniqueCode} 
                disabled={true}
                readOnly={true}
                onChange={(e) => setTUniqueCode(e.target.value)}
                type='text'/>
            {error && <h5 style={{color:'red',fontFamily:'inherit'}}>{error}</h5>}
            <div>
            <button onClick={saveTeacherDetails} className='btn btn-info'>Save Changes</button>
            <button 
                style={{marginLeft:'30px'}}
                className="btn btn-danger"
                onClick={() => setDeleteTeacherDialogShow(true)}>Delete</button>
            </div>
            </div>
        }
    </div>
        )
        return data;
    }
    const saveTeacherDetails = () =>{
        setError("");
        if (tUniqueCode.length !== 4){
            setError("Unique Code must be of 4 digits")
        }
        else if (tName && tUserUid && tUniqueCode.length == 4){
            db.collection("AllTeachers").doc(String(tUniqueCode)).set({
                "name" : tName,
                "userUid" : tUserUid,
                "uniqueCode" : tUniqueCode
            }).then(() =>{
                seteditDivDisplay("");
                setTName("");
                setTUserUid("");
                setTUniqueCode("");
                setDialogTitle("Success");
                setDialogType(true);
                setDialogContent("Successfully Saved");
                setDialogShow(true);
            }).catch((e) =>{
                console.log(e)
                setDialogTitle("Failed");
                setDialogType(false);
                setDialogContent("Failed to Save,Try again");
                setDialogShow(true);
            })
        }
        else{
            setError("Fill all Details")
        }
    }

    const DeleteTeacher = () =>{
        if (tUniqueCode){
            setDeleteTeacherDialogShow(false);
            db.collection("AllTeachers").doc(String(tUniqueCode)).delete()
            .then(() =>{
                setDialogTitle("Success");
                setDialogContent("Successfully Deleted " + tName);
                setDialogType(true);
                setDialogShow(true);
                setTName("");
                setTUniqueCode("");
                setTUserUid("");
                
            })
            .catch((e) =>{
                setDialogTitle("Failed");
                setDialogContent("Failed to Delete");
                setDialogType(false);
                setDialogShow(true);
            })
        }
    }

    const checkUniqueCodeExist = () =>{
        if (tUniqueCode){
            db.collection('AllTeachers').doc(String(tUniqueCode)).get().then((doc) =>{
                if (doc.exists){
                    setError(tUniqueCode + " Unique Code already exists");
                    setTUniqueCode("");
                }
            });            
        }
    }


    return(
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


            <Dialog 
                open={deleteTeacherDialogShow} 
                onClose={
                    () => {
                        setDeleteTeacherDialogShow(false);
                        }}>
                <DialogTitle style={{color:'red'}}>Alert!</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Are you Sure to Delete {tName} ?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={DeleteTeacher} color="primary">
                    Yes
                </Button>    
                <Button onClick={() => {
                    setDeleteTeacherDialogShow(false);
                    }} 
                        color="primary" autoFocus>
                    No
                </Button>
                </DialogActions>
            </Dialog>

            {getAllTeachers()}
            
            <div className='studentsNameListMainDiv'>
                <div 
                    className="studentsNameList" 
                    onClick={() => {
                        if (!addNewTeacherActive){
                            setAddNewTeacherActive(true);
                            seteditDivDisplay("");
                            setTName("");
                            setTUniqueCode("");
                            setTUserUid("");
                            setError("");
                        }
                        else{
                            setAddNewTeacherActive(false);
                            setTName("");
                            setTUniqueCode("");
                            setTUserUid("");
                        }
                        }}>
                    <div className='studentsDetailsSpan admNo' style={{width:'auto'}}>Add New +</div>
                </div>
                {addNewTeacherActive &&
                <div className='studentsNameListEditDiv'>
                    <label className='studentsDetailEditLabel'>Unique Code:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={tUniqueCode} 
                        onFocus={() => setError("")}
                        onChange={(e) => setTUniqueCode(e.target.value)}
                        type="number"
                        onBlur={checkUniqueCodeExist}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>Name:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={tName} 
                        onChange={(e) => setTName(e.target.value)}
                        type='text' />
                    <label className='studentsDetailEditLabel'>User Uid:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={tUserUid} 
                        onChange={(e) => setTUserUid(e.target.value)}
                        type='text'/>
                    {error && <h5 style={{color:'red',fontFamily:'inherit'}}>{error}</h5>}
                    <div>
                    <button onClick={saveTeacherDetails} className='btn btn-info'>Save</button>
                    </div>
                    </div>
                }
            </div>
        </div>
    )
}