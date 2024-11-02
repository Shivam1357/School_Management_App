import React, { useState } from "react";
import {db} from '../firebase';
import "./allStudents.css";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";


function AllStudents(){
    document.title = 'All Students';

    const [sessionSearching, setSessionSearching] = useState(null);
    const [classSearching, setClassSearching] = useState(null);
    const [admNoSearching, setAdmNoSearching] = useState(null);
    const [admNoSearching2, setAdmNoSearching2] = useState(null);
    const [admNoSearchData, setAdmNoSearchData] = useState([]);

    const [sAdmNo, setSAdmNo] = useState("");
    const [sName, setSName] = useState("");
    const [sClass, setSClass] = useState("");
    const [fName, setFName] = useState("");
    const [uUid, setUUid] = useState("");
    const [sSession, setSSession] = useState("");
    const [sDOB, setSDOB] = useState("");

    const [addNewStudentActive, setAddNewStudentActive] = useState('');
    const [error, setError] = useState('');
    const [errorAdmExist, setErrorAdmExist] = useState('Exist');

    const [dialogShow, setDialogShow] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");


    const [deleteStudentDialogShow, setDeleteStudentDialogShow] = useState(false);



    const [allSession, setAllSession] = useState([]);
    const GetAllSession = () =>{
        let a = db.collection('Sessions');
        let data = useCollectionData(a,{idField:'id'})[0];
        return {data}
    }
    let {data} = GetAllSession();
    if (data && data !== allSession){   
        setAllSession(data)
    }
    const getAllSessionOption = () =>{
        let a1 = allSession.map((s) =>
            <option key={s.id} value={s.sessionPeriod}>{s.sessionPeriod}</option>
        )
        return a1;
    }


    const [allClass, setAllClass] = useState([]);
    const GetAllClass = () =>{
        let a = db.collection('AllClass');
        let data2 = useCollectionData(a,{idField:'id'})[0];
        return {data2}
    }
    let {data2} = GetAllClass();
    if (data2 && data2 !== allClass){   
        setAllClass(data2)
    }
    const getAllClassOption = () =>{
        let a2 = allClass.map((c) =>
            // <option key={c.classCode} value={c.classCode} >{c.classCode}</option>
            <option key={c.classCode} value={c.classCode} >{c.class}-{c.section}</option>
        )
        return a2;
    }


    



    const [allSearchedStudents, setallSearchedStudents] = useState([]);
    const GetAllStudentsClass = (classCode,session) =>{
        let students = db.collection('AllStudents')
            .where("session","==",session)
            .where('classCode',"==",classCode);
        let allData1 = useCollectionData(students,{idField:'id'})[0];
        //console.log("a")
        return {allData1};
    }
    let {allData1} = GetAllStudentsClass(classSearching,sessionSearching);
    
    if (allData1 && allSearchedStudents !== allData1){
        setallSearchedStudents(allData1)
    }


    const GetStudentsByAdm = (adm2) =>{
        let students = db.collection('AllStudents')
            .where('admNo',"==",adm2);
        let allData3 = useCollectionData(students,{idField:'id'})[0];
        //console.log("b")
        return {allData3};
    }
    let {allData3} = GetStudentsByAdm(admNoSearching2);
    if (allData3 && allData3 !== admNoSearchData){
        setAdmNoSearchData(allData3)
    }
    
    const searchByAdmNo = () => {
        setSAdmNo("");
        setSName("");
        setSClass("");
        setSDOB("");
        setUUid("");
        setSSession("");
        setFName("");
        setError("");
        setAdmNoSearching2(admNoSearching)
    }
    // console.log(admNoSearchData)

    const admNoSearchStudent = () =>{
        let student = admNoSearchData[0];
        //console.log(admNoSearchData)
        let dat = <div className='studentsNameListEditDiv'>
                    {sAdmNo === "" ? setSAdmNo(student.admNo) : ""}
                    {sName === "" ? setSName(student.name) : ""}
                    {sClass === "" ? setSClass(student.classCode) : ""}
                    {fName === "" ? setFName(student.fatherName) : ""}
                    {uUid === ""? setUUid(student.userUid) : ""}
                    {sSession === "" ? setSSession(student.session) : ""}
                    {sDOB === "" ? setSDOB(student.dob) : ""}

                    <label className='studentsDetailEditLabel'>Admission No:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={sAdmNo} 
                        onChange={(e) => setSAdmNo(e.target.value)}
                        type='text' 
                        disabled={true}
                        readOnly={true}/>
                    <label className='studentsDetailEditLabel'>Name:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={sName} 
                        onChange={(e) => setSName(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>Class:</label><br/>
                    <select  
                        style={{width:'100%',height:'30px',marginBottom:'20px'}}
                        onChange={(e)=> setSClass(e.target.value)}
                        value={sClass}>
                        {getAllClassOption()}
                    </select><br/>
                    {/* <input 
                        className='studentsDetailEditInput' 
                        value={sClass} 
                        onChange={(e) => setSClass(e.target.value)}
                        type='text'/> */}
                    <label className='studentsDetailEditLabel'>Father's Name:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={fName} 
                        onChange={(e) => setFName(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>Date of Birth:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={sDOB} 
                        onChange={(e) => setSDOB(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>User UID:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={uUid} 
                        onChange={(e) => setUUid(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>Session:</label><br/>
                    <select 
                        style={{width:'100%',height:'30px',marginBottom:'20px'}}
                        onChange={(e)=> setSSession(e.target.value)} 
                        value={sSession}>
                        {getAllSessionOption()}
                    </select><br/>
                    {/* <input 
                        className='studentsDetailEditInput' 
                        value={sSession} 
                        onChange={(e) => setSSession(e.target.value)}
                        type='text'/> */}
                    {error && <h5 style={{color:'red',fontFamily:'inherit'}}>{error}</h5>}
                    <button onClick={saveStudentDetails} className='btn btn-info'>Save Changes</button>
                    <button 
                        style={{marginLeft:'30px'}}
                        className="btn btn-danger"
                        onClick={() => setDeleteStudentDialogShow(true)}>Delete</button>
                </div>
                return dat;
    }

    



    const [editDivDisplay, seteditDivDisplay] = useState('');
    
    const allStudentsDisplay = () =>{
        let data = allSearchedStudents.map((student) => 
            <div className='studentsNameListMainDiv' key={student.admNo}>
                <div 
                    className="studentsNameList" 
                    onClick={() => {
                        if (editDivDisplay !== student.admNo){
                            seteditDivDisplay(student.admNo)
                        }
                        else{
                            seteditDivDisplay(null);
                            setSAdmNo("");
                            setSName("");
                            setSClass("");
                            setSDOB("");
                            setUUid("");
                            setSSession("");
                            setFName("");
                            setError("");
                        }
                        }}>
                    <div className='studentsDetailsSpan index'>{allSearchedStudents.indexOf(student)+1}</div>
                    <div className='studentsDetailsSpan admNo'>{student.admNo}</div>
                    <div className='studentsDetailsSpan name'>{student.name}</div>
                    <div className='studentsDetailsSpan fname'>{student.fatherName}</div>
                    <div className='studentsDetailsSpan session'>{student.session}</div>
                </div>
                {editDivDisplay === student.admNo &&
                <div className='studentsNameListEditDiv'>
                    {sAdmNo === "" ? setSAdmNo(student.admNo) : ""}
                    {sName === "" ? setSName(student.name) : ""}
                    {sClass === "" ? setSClass(student.classCode) : ""}
                    {fName === "" ? setFName(student.fatherName) : ""}
                    {uUid === ""? setUUid(student.userUid) : ""}
                    {sSession === "" ? setSSession(student.session) : ""}
                    {sDOB === "" ? setSDOB(student.dob) : ""}

                    <label className='studentsDetailEditLabel'>Admission No:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={sAdmNo} 
                        onChange={(e) => setSAdmNo(e.target.value)}
                        type='text' 
                        disabled={true}
                        readOnly={true}/>
                    <label className='studentsDetailEditLabel'>Name:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={sName} 
                        onChange={(e) => setSName(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>Class:</label><br/>
                    <select  
                        style={{width:'100%',height:'30px',marginBottom:'20px'}}
                        onChange={(e)=> setSClass(e.target.value)}
                        value={sClass}>
                        {getAllClassOption()}
                    </select><br/>
                    {/* <input 
                        className='studentsDetailEditInput' 
                        value={sClass} 
                        onChange={(e) => setSClass(e.target.value)}
                        type='text'/> */}
                    <label className='studentsDetailEditLabel'>Father's Name:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={fName} 
                        onChange={(e) => setFName(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>Date of Birth:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={sDOB} 
                        onChange={(e) => setSDOB(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>User UID:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={uUid} 
                        onChange={(e) => setUUid(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>Session:</label><br/>
                    <select 
                        style={{width:'100%',height:'30px',marginBottom:'20px'}}
                        onChange={(e)=> setSSession(e.target.value)} 
                        value={sSession}>
                        {getAllSessionOption()}
                    </select><br/>
                    {/* <input 
                        className='studentsDetailEditInput' 
                        value={sSession} 
                        onChange={(e) => setSSession(e.target.value)}
                        type='text'/> */}
                    {error && <h5 style={{color:'red',fontFamily:'inherit'}}>{error}</h5>}
                    <div>
                    <button onClick={saveStudentDetails} className='btn btn-info'>Save Changes</button>
                    <button 
                        style={{marginLeft:'30px'}}
                        className="btn btn-danger"
                        onClick={() => setDeleteStudentDialogShow(true)}>Delete</button>
                    </div>
                    </div>
                }
            </div>
        )
        return data
    }
    
    const saveStudentDetails = () =>{
        if(sAdmNo && sName && fName && sClass && sClass!== "Select Class:" && uUid && sDOB && sSession && sSession !== "Select Session:"){
            setError("");
            db.collection("AllStudents").doc(sAdmNo).set({
                "admNo" : sAdmNo,
                "name" : sName,
                "fatherName" : fName,
                "classCode" : sClass,
                "userUid" : uUid,
                "dob" : sDOB,
                "session" : sSession
            }).then((e) =>{
                setDialogTitle("Success");
                setDialogContent("Successfully Saved");
                setDialogShow(true);

                seteditDivDisplay(null);
                setSAdmNo("");
                setSName("");
                setSClass("");
                setSDOB("");
                setUUid("");
                setFName("");
                setSSession("");
                setAddNewStudentActive("");
                setAdmNoSearching2("");
                setAdmNoSearchData([]);
            })
            .catch((error) =>{
                setError("Some Error Occured in data Validation")
            })

            
        }
        else{
            setError("Fill all the Details");
        }        
    }
    const checkAdmExist = () =>{
        if (sAdmNo){
            db.collection('AllStudents').doc(sAdmNo).get().then((doc) =>{
                if (doc.exists){
                    setErrorAdmExist(sAdmNo + " Admission Number already Exists");
                    setSAdmNo("");
                }
            });            
        }
    }
    const DeleteStudent = () =>{
        if (sAdmNo){
            // console.log("del " +sAdmNo );
            setDeleteStudentDialogShow(false);
            db.collection("AllStudents").doc(sAdmNo).delete().then(() =>{
                setDialogTitle("Success");
                setDialogContent("Successfully Deleted");
                setDialogShow(true)
            });

            
        }
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
                <DialogTitle style={{color:'green'}}>{dialogTitle}</DialogTitle>
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
                open={deleteStudentDialogShow} 
                onClose={
                    () => {
                        setDeleteStudentDialogShow(false);
                        }}>
                <DialogTitle style={{color:'red'}}>Alert!</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Are you Sure to Delete Admission No.{sAdmNo},{sName}?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={DeleteStudent} color="primary" autoFocus>
                    Yes
                </Button>    
                <Button onClick={() => {
                    setDeleteStudentDialogShow(false);
                    }} 
                        color="primary" autoFocus>
                    No
                </Button>
                </DialogActions>
            </Dialog>

            <div style={{
                width:'100%',
                padding:'10px 10px 10px 10px',
                borderRadius:'10px',
                display:'flex'
                }}
                className="SelectCSDiv">
                <select 
                    value={sessionSearching}
                    onChange={(e)=> {
                        setSessionSearching(e.target.value);
                        if(admNoSearching){
                            setAdmNoSearching("")
                        }
                        setAdmNoSearching2("");
                        setSAdmNo("");
                        setSName("");
                        setSClass("");
                        setSDOB("");
                        setUUid("");
                        setSSession("");
                        setFName("");
                        setError("");
                        setErrorAdmExist("");}} 
                    style={{width:'250px',height:'35px',marginRight:'10px',borderRadius:'12px'}}>
                    <option defaultChecked={true} value="">Select Session:</option>
                    {getAllSessionOption()}
                </select>
                
                <select  
                    value={classSearching}
                    onChange={(e)=> {
                        setClassSearching(e.target.value);
                        if(admNoSearching){
                            setAdmNoSearching("")
                        };
                        setAdmNoSearching2("");
                        setSAdmNo("");
                        setSName("");
                        setSClass("");
                        setSDOB("");
                        setUUid("");
                        setSSession("");
                        setFName("");
                        setError("");
                        setErrorAdmExist("");
                    }}
                    style={{width:'250px',height:'35px',marginRight:'10px',borderRadius:'12px'}}>
                    <option defaultChecked={true} value="">Select Class:</option>
                    {getAllClassOption()}
                </select><br/>
                <span style={{margin:'20px'}}>Or</span>
                <input 
                    value={admNoSearching}
                    placeholder="Enter Admission Number"
                    onChange={(e) => {
                            setAdmNoSearching(e.target.value);
                            if(classSearching){
                                setClassSearching("")
                            };
                            if(sessionSearching)
                            {setSessionSearching("")} 
                        }}
                    style={{width:'250px',height:'35px',marginRight:'10px',borderRadius:'12px'}}/>
                <button 
                    style={{height:'40px'}}
                    onClick={searchByAdmNo} className='btn btn-info'>Search</button>
            </div>
            <div style={{margin:"10px 0px"}}>
                {allStudentsDisplay()}
                {admNoSearchData.length !== 0 && admNoSearchStudent()}

                <div className='studentsNameListMainDiv'>
                    <div 
                        className="studentsNameList" 
                        onClick={() => {
                            if (!addNewStudentActive){
                                setAddNewStudentActive(true);
                                setErrorAdmExist("");
                            }
                            else{
                                setAddNewStudentActive(false);
                                setSAdmNo("");
                                setSName("");
                                setSClass("");
                                setSDOB("");
                                setUUid("");
                                setSSession("");
                                setFName("");
                                setError("");
                                setErrorAdmExist("");
                            }
                            }}>
                            <div>Add New Student +</div>
                    </div>
                    {addNewStudentActive &&
                    <div className='studentsNameListEditDiv'>
                        <label className='studentsDetailEditLabel'>Admission No:</label>
                        <input 
                            className='studentsDetailEditInput' 
                            value={sAdmNo}
                            onChange={(e) => setSAdmNo(e.target.value)}
                            onFocus={() => setErrorAdmExist("")}
                            onBlur={checkAdmExist}
                            type='number'/>
                        {errorAdmExist && <h5 style={{color:'red',fontFamily:'inherit',marginTop:'-10px'}}>{errorAdmExist}</h5>}
                        <label className='studentsDetailEditLabel'>Name:</label>
                        <input 
                            className='studentsDetailEditInput' 
                            value={sName} 
                            onChange={(e) => setSName(e.target.value)}
                            type='text'/>
                        <label className='studentsDetailEditLabel'>Class:</label><br/>
                        <select  
                            style={{width:'100%',height:'30px',marginBottom:'20px'}}
                            onChange={(e)=> setSClass(e.target.value)}>
                            <option defaultChecked={true}>Select Class:</option>
                            {getAllClassOption()}
                        </select><br/>
                        {/* <input 
                            className='studentsDetailEditInput' 
                            value={sClass} 
                            onChange={(e) => setSClass(e.target.value)}
                            type='text'/> */}
                        <label className='studentsDetailEditLabel'>Father's Name:</label>
                        <input 
                            className='studentsDetailEditInput' 
                            value={fName} 
                            onChange={(e) => setFName(e.target.value)}
                            type='text'/>
                        <label className='studentsDetailEditLabel'>Date of Birth:</label>
                        <input 
                            className='studentsDetailEditInput' 
                            value={sDOB} 
                            onChange={(e) => setSDOB(e.target.value)}
                            type='text'/>
                        <label className='studentsDetailEditLabel'>User UID:</label>
                        <input 
                            className='studentsDetailEditInput' 
                            value={uUid} 
                            onChange={(e) => setUUid(e.target.value)}
                            type='text'/>
                        <label className='studentsDetailEditLabel'>Session:</label><br/>
                        <select 
                            style={{width:'100%',height:'30px',marginBottom:'20px'}}
                            onChange={(e)=> setSSession(e.target.value)} >
                            <option defaultChecked={true}>Select Session:</option>
                            {getAllSessionOption()}
                        </select><br/>
                        {/* <input 
                            className='studentsDetailEditInput' 
                            value={sSession} 
                            onChange={(e) => setSSession(e.target.value)}
                            type='text'/> */}
                        {error && <h5 style={{color:'red',fontFamily:'inherit'}}>{error}</h5>}
                        <button onClick={saveStudentDetails} className='btn btn-info'>Save</button>
                    </div>
                    }
                </div>




                {/* <div className="studentsNameList" >
                    <span>1.</span>
                    <span>Shivam Kumar Jaiswal</span>
                </div> */}

            </div>
        </div>
    )
}
export default AllStudents;