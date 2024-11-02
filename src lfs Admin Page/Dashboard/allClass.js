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


const AllClass = (props) => {
    document.title = "Classes";

    const [dialogShow, setDialogShow] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");
    const [dialogType, setDialogType] = useState(true);

    const [deleteClassDialogShow, setDeleteClassDialogShow] = useState(false);

    const [error, setError] = useState("");
    const [editDivDisplay, seteditDivDisplay] = useState("");

    const [cClassCode, setCClassCode] = useState("");
    const [cClass, setCClass] = useState("");
    const [cClassTeacherUniqueCode, setCClassTeacherUniqueCode] = useState("");
    const [cSection, setCSection] = useState("");

    const [addNewClassActive, setAddNewClassActive] = useState(false);

    const [allClass, setAllClass] = useState([]);

    const [allTeachersList, setAllTeachersList] = useState([]);
    const [allTeachersListDic, setAllTeachersListDic] = useState({});
    const [selectTacherDialogShow, setSelectTacherDialogShow] = useState(false);
    const [selectTeacherSelected, setSelectTeacherSelected] = useState("");
    

    const GetAllTeachers = () =>{
        let q = db.collection('AllTeachers');
        let all2 = useCollectionData(q,{idField:'id'})[0];
        return {all2};
    }
    let {all2} = GetAllTeachers();
    
    if (all2 && all2 !== allTeachersList){
        let a = {};
        for (var i = 0;all2.length>i ; i++){
            a[all2[i]['uniqueCode']] = all2[i]['name']
        }
        setAllTeachersListDic(a)
        setAllTeachersList(all2)
    }
    // console.log(allTeachersListDic)

    const getAllTeachersOption = () =>{
        let a = allTeachersList.map((t) =>
            <option value={t.uniqueCode} key={t.uniqueCode}>{t.name}</option>
        )
        return a
    }


    const GetData = () =>{
        let q = db.collection('AllClass');
        let all = useCollectionData(q,{idField:'id'})[0];
        return {all};
    }
    let {all} = GetData();
    
    if (all && all !== allClass){
        setAllClass(all)
    }
    //console.log(allClass);

    const getAllClasses = () =>{
        let data = allClass.map((classq) =>
        <div className='studentsNameListMainDiv' key={classq.classCode}>
        <div 
            className="studentsNameList" 
            onClick={() => {
                if (editDivDisplay !== classq.classCode){
                    seteditDivDisplay(classq.classCode);
                    setError("");
                    setAddNewClassActive(false);
                    // setCClass("");
                    // setCClassCode("");
                    // setCClassTeacherUniqueCode("");
                    // setCSection("");
                    setCClass(classq.class);
                    setCClassCode(classq.classCode);
                    setCClassTeacherUniqueCode(classq.classTeacherUniqueCode);
                    setCSection(classq.section);
                    setSelectTeacherSelected(classq.classTeacherUniqueCode)
                }
                else{
                    seteditDivDisplay(null);
                    setError("");
                    setCClass("");
                    setCClassCode("");
                    setCClassTeacherUniqueCode("");
                    setCSection("");
                }
                }}>
            <div className='studentsDetailsSpan index'>{allClass.indexOf(classq)+1}</div>
            <div className='studentsDetailsSpan admNo'>{classq.class}-{classq.section}</div>
            <div 
                className='studentsDetailsSpan admNo' 
                style={{width:'auto'}}>
                    {allTeachersListDic[classq.classTeacherUniqueCode]}
            </div>
        </div>
        {editDivDisplay === classq.classCode &&
        <div className='studentsNameListEditDiv'>
            {/* {cClass === "" ? setCClass(classq.class) : ""}
            {cClassCode === "" ? setCClassCode(classq.classCode) : ""}
            {cClassTeacherUniqueCode === "" ? setCClassTeacherUniqueCode(classq.classTeacherUniqueCode) : ""}
            {cSection === "" ? setCSection(classq.section) : ""} */}

            <label className='studentsDetailEditLabel'>Class:</label>
            <input 
                className='studentsDetailEditInput' 
                value={cClass} 
                onChange={(e) => setCClass(e.target.value)}
                readOnly={true}
                type='text' />
            <label className='studentsDetailEditLabel'>Section:</label>
            <input 
                className='studentsDetailEditInput' 
                value={cSection} 
                readOnly={true}
                onChange={(e) => setCSection(e.target.value)}
                type='text'/>
            <label className='studentsDetailEditLabel'>Class Code:</label>
            <input 
                className='studentsDetailEditInput' 
                value={cClassCode} 
                readOnly={true}
                onChange={(e) => setCClassCode(e.target.value)}
                type='text'/>
            <label className='studentsDetailEditLabel'>Class Teacher Unique Code:</label>
            <input 
                className='studentsDetailEditInput' 
                value={cClassTeacherUniqueCode}
                readOnly={true}
                onChange={(e) => setCClassTeacherUniqueCode(e.target.value)}
                type='text'/>
            <button 
                onClick={()=> setSelectTacherDialogShow(true)} 
                className="btn btn-dark"
                style={{marginTop:'-15px',marginBottom:'20px'}}>Get Teachers Unique Code</button>
            {error && <h5 style={{color:'red',fontFamily:'inherit'}}>{error}</h5>}
            <div>
            <button onClick={saveClassDetails} className='btn btn-info'>Save Changes</button>
            <button 
                style={{marginLeft:'30px'}}
                className="btn btn-danger"
                onClick={() => setDeleteClassDialogShow(true)}>Delete</button>
            </div>
            </div>
        }
    </div>
        )
        return data;
    }
    const saveClassDetails = () =>{
        if (cClass && cSection && cClassCode && cClassTeacherUniqueCode){
            if (cClassTeacherUniqueCode.length === 4){
                db.collection("AllClass").doc(String(cClassCode)).set({
                    "class": cClass,
                    "section" : cSection,
                    "classTeacherUniqueCode" : cClassTeacherUniqueCode,
                    "classCode" :  cClassCode
                }).then(() =>{
                    setDialogTitle("Success");
                    setDialogType(true);
                    setDialogContent("Successfully Saved");
                    setDialogShow(true);
                    setCClass("");
                    setCClassCode("");
                    setCSection("");
                    setCClassTeacherUniqueCode("");
                    seteditDivDisplay("");
                }).catch((e) =>{
                    setDialogTitle("Failed");
                    setDialogType(false);
                    setDialogContent("Some Error Occured ,Try Again");
                    setDialogShow(true);
                })
            }
            else{
                setError("Class Teacher Unique Code is of 4 digits")
            }
        }
        else{
            setError("Fill all the Details")
        }
    }

    const generateClassCode = () =>{
        let alpha = " ABCDEFGHIabcdefghi";
        if (cClass && cSection){
            var a = Number(alpha.indexOf(cSection));
            if (a > -1){
                if (a > 9){
                    a = a-9
                    setCSection(alpha.charAt(a))
                }
                db.collection("AllClass").doc(String(cClass) + String(a)).get().then((doc) =>{
                    if (doc.exists){
                        setError("Class " + cClass + "-" + alpha.charAt(a) + " already exists")
                    }
                    else{
                        setCClassCode(String(cClass)+ String(a));
                    }
                })
            }
            else{
                setCClassCode("");
            }

        }
    }

    const DeleteClass = () =>{
        if (cClassCode){
            console.log("delete");
            setDeleteClassDialogShow(false);
            db.collection("AllClass").doc(String(cClassCode)).delete()
            .then(() =>{
                setDialogTitle("Success");
                setDialogType(true);
                setDialogContent("Successfully Deleted " + cClass + "-" + cSection)
                setDialogShow(true);
                setCClass("");
                setCClassCode("");
                setCSection("");
                setCClassTeacherUniqueCode("");
                seteditDivDisplay("");
            })
            .catch(() =>{
                setDialogTitle("Failed");
                setDialogType(false);
                setDialogContent("Failed to delete, Try Again")
                setDialogShow(true);
            })
        }
        
    }

    return (
        <div>
            {/* Normal Dialog */}
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

            {/* Dialog to Delete */}
            <Dialog 
                open={deleteClassDialogShow} 
                onClose={
                    () => {
                        setDeleteClassDialogShow(false);
                        }}>
                <DialogTitle style={{color:'red'}}>Alert!</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Are you Sure to Delete Class {cClass}-{cSection}  ?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={DeleteClass} color="primary">
                    Yes
                </Button>    
                <Button onClick={() => {
                    setDeleteClassDialogShow(false);
                    }} 
                        color="primary" autoFocus>
                    No
                </Button>
                </DialogActions>
            </Dialog> 

            {/* select Teacher Dialog */}
            <Dialog 
                open={selectTacherDialogShow} 
                onClose={
                    () => {setSelectTacherDialogShow(false)}}>
                <DialogTitle style={{color:'black'}}>Select Class Teacher</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    <select 
                        value={selectTeacherSelected}
                        style={{padding:'10px',borderRadius:'5px'}}
                        onChange={(e) => setSelectTeacherSelected(e.target.value)} >
                        <option value="Select Teacher:">Select Teacher:</option>
                        {getAllTeachersOption()}
                    </select>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() =>{
                    if (selectTeacherSelected !== "Select Teacher:"){
                        setCClassTeacherUniqueCode(selectTeacherSelected)
                    }
                    else{
                        setCClassTeacherUniqueCode("")
                    }
                    setSelectTacherDialogShow(false);
                }} color="primary">
                    Done
                </Button>
                </DialogActions>
            </Dialog>

            {getAllClasses()}

            <div className='studentsNameListMainDiv'>
                <div 
                    className="studentsNameList" 
                    onClick={() => {
                        if (!addNewClassActive){
                            setAddNewClassActive(true);
                            seteditDivDisplay("");
                            setCClass("");
                            setCClassCode("");
                            setCClassTeacherUniqueCode("");
                            setCSection("");
                            setError("");
                        }
                        else{
                            setAddNewClassActive(false);
                            setCClass("");
                            setCClassCode("");
                            setCClassTeacherUniqueCode("");
                            setCSection("");
                            setError("");
                        }
                        }}>
                    <div className='studentsDetailsSpan admNo' style={{width:'auto'}}>Add New +</div>
                </div>
                {addNewClassActive &&
                <div className='studentsNameListEditDiv'>
                    <label className='studentsDetailEditLabel'>Class:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={cClass} 
                        onFocus={() => {setError("");setCClassCode("")}}
                        onBlur={generateClassCode}
                        onChange={(e) => setCClass(e.target.value)}
                        type='text' />
                    <label className='studentsDetailEditLabel'>Section:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={cSection} 
                        onFocus={() => {setError("");setCClassCode("")}}
                        onBlur={generateClassCode}
                        onChange={(e) => setCSection(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>Class Code:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={cClassCode} 
                        readOnly={true}
                        onChange={(e) => setCClassCode(e.target.value)}
                        type='text'/>
                    <label className='studentsDetailEditLabel'>Class Teacher Unique Code:</label>
                    <input 
                        className='studentsDetailEditInput' 
                        value={cClassTeacherUniqueCode}
                        onFocus={() => setError("")}
                        readOnly={true}
                        onChange={(e) => setCClassTeacherUniqueCode(e.target.value)}
                        type='text'/>
                    <button 
                        onClick={()=> setSelectTacherDialogShow(true)} 
                        className="btn btn-dark"
                        style={{marginTop:'-15px',marginBottom:'20px'}}>Get Teachers Unique Code</button>
                    {error && <h5 style={{color:'red',fontFamily:'inherit'}}>{error}</h5>}
                    <div>
                    <button onClick={saveClassDetails} className='btn btn-info'>Save</button>
                    </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default AllClass
