import {auth, firestore} from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";


async function GetUserClassDetail(uCode){
    let a1 = []
    const classesRef = collection(firestore, "AllClass");
    const q2 = query(classesRef, where("classTeacherUniqueCode", "==", uCode));

    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
        a1.push(doc.data())
    });
    return a1[0];
}

async function GetUserData(){
    let a = [];
    const TeachersRef = collection(firestore, "AllTeachers");
    const q1 = query(TeachersRef, where("userUid", "==",auth.currentUser.uid));
    const querySnapshot1 = await getDocs(q1);
    querySnapshot1.forEach((doc) => {
        a.push(doc.data())
    });
    return a[0];
}

async function GetAllClassesData(){
    let a = [];
    const AllClassesRef = collection(firestore, "AllClass");
    const querySnapshot1 = await getDocs(AllClassesRef);
    querySnapshot1.forEach((doc) => {
        a.push(doc.data())
    });
    return a;
}


export {GetUserClassDetail,GetUserData,GetAllClassesData}