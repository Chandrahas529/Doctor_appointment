import Appoinments from "./Appointments";
import src from '../images/empty.png'
import './Settings.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function Settings() {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:'instant'
        })
    },[])
    return (<>
        <div>
            <Appointments />
            <Userdetails />
            <Logout />
        </div>
    </>)
}

function Appointments() {
    const userid = JSON.parse(localStorage.getItem('user'))._id;
    const [list, setList] = useState([]);
    const [doc, setDoc] = useState([]);
    useEffect(() => {
        getAppoints()
    }, [])
    const getAppoints = async () => {
        let result = await fetch('http://localhost:5000/appoints/' + userid);
        result = await result.json();
        const newDataPromises = result.map(item =>
            fetch(`http://localhost:5000/doctordetails/${item.doctorId}`).then(res => res.json())
        );
        const newData = await Promise.all(newDataPromises);
        const combinedData = result.map((item, index) => ({
            ...item,
            src: newData[index].src,
            speciallistof: newData[index].speciallistof
        }));
        setList(combinedData);
    }
    const appointC = async (id) => {
        console.log(id)
        let result = await fetch('http://localhost:5000/appointstatus/' + id, {
            method: "put",
            headers: { 'Content-Type': 'application/json' },
            body: ''
        });
        console.log(await result.json())
        getAppoints();
    }
    return (<>
        <div className="appoints">
            <span className="recent">Recent Appointments</span>
            <div className="appoints-ctn">
                {
                    list.map((res) =>
                        <div key={res._id} className="wrapper">
                            <div className="left-w">
                                <div>Appointment with {res.doctorName} at <b>{res.timing} </b>on<b> {res.date}</b></div>
                                <div className="cbs"><div>Specialist - {res.speciallistof}</div><div>Booked on - {res.bookedOn}</div></div>
                                <div className="cbs"><div>Status - <b>{res.status}</b></div>
                                    {(res.status === "Pending") ? <button onClick={() => { appointC(res._id) }} className="cancel">Cancel</button> : ''}
                                </div>
                            </div>
                            <div className="right-w"><div className="ig"><img src={require('../Doctors/' + res.src)} /></div></div>
                        </div>
                    )}
            </div>
        </div>
    </>)
}
function Userdetails() {
    let auth = JSON.parse(localStorage.getItem('user'));
    let userid = JSON.parse(localStorage.getItem('user'))._id;
    const [name, setName] = useState(auth.name)
    const [email, setEmail] = useState(auth.email)
    const [mobile, setMobile] = useState(auth.mobile)
    const [password, setPassword] = useState('*******');
    const [image, setImage] = useState('')
    const [dp, setDp] = useState(auth.src)
    function changeName(n) {
        document.getElementsByClassName('invisible')[n].disabled = false;
        document.getElementsByClassName('btns')[n].style.display = 'flex';
    }
    function cancelName(n) {
        setName(auth.name);
        document.getElementsByClassName('invisible')[n].disabled = true;
        document.getElementsByClassName('btns')[n].style.display = 'none';
    }
    function changePassword(n) {
        setPassword('')
        document.getElementsByClassName('invisible')[n].disabled = false;
        document.getElementsByClassName('btns')[n].style.display = 'flex';
    }
    function cancelPassword(n) {
        setPassword('******');
        document.getElementsByClassName('invisible')[n].disabled = true;
        document.getElementsByClassName('btns')[n].style.display = 'none';
    }
    async function saveName() {
        let result = await fetch('http://localhost:5000/updateuser/' + userid, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, mobile })
        });
        result = await result.json();
        if (result.acknowledged) {
            let res = await fetch('http://localhost:5000/user/' + userid)
            res = await res.json();
            localStorage.setItem('user', JSON.stringify(res))
        }
        window.location.reload()
    }
    async function savePassword(n) {
        if (password === '') {

        } else {
            let result = await fetch('http://localhost:5000/userpassword/' + userid, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
        }
        cancelPassword(n)
    }
    function uploadImg(e) {
        document.getElementsByClassName('btn')[0].style.display = 'flex';
        setImage(e.target.files[0])
    }
    async function saveImg() {
        const formData = new FormData();
        formData.append('src', image);
        let result = await fetch(`http://localhost:5000/updateimg/${userid}`, {
            method: 'POST',
            body: formData
        });
        result = await result.json();
        if (result.acknowledged) {
            let res = await fetch('http://localhost:5000/user/' + userid)
            res = await res.json();
            localStorage.setItem('user', JSON.stringify(res))
        }
        window.location.reload()
        cancelImg();
    }
    function cancelImg() {
        document.getElementsByClassName('btn')[0].style.display = 'none';
    }
    return (<>
        <div className="user-info">
            <span className="recent">Your details</span>
            <div className="user-bio">
                <div className="list-detail">Name - <div><div><input className="invisible" type="text" disabled value={name} onChange={(e) => { setName(e.target.value) }} /> <i onClick={() => { changeName(0) }} className="fa-solid fa-pencil pointers"></i></div><div className="btns"><button onClick={() => { saveName(0) }} className="save-btn">Save</button><button onClick={() => { cancelName(0) }} className="cancel-btn">Cancel</button></div></div></div>
                <div className="list-detail">Email - <div><div><input className="invisible" type="text" disabled value={email} onChange={(e) => { setEmail(e.target.value) }} /> <i onClick={() => { changeName(1) }} className="fa-solid fa-pencil pointers"></i></div><div className="btns"><button onClick={() => { saveName(1) }} className="save-btn">Save</button><button onClick={() => { cancelName(1) }} className="cancel-btn">Cancel</button></div></div></div>
                <div className="list-detail">Mobile No - <div><div><input className="invisible" type="text" disabled value={mobile} onChange={(e) => { setMobile(e.target.value) }} /> <i onClick={() => { changeName(2) }} className="fa-solid fa-pencil pointers"></i></div><div className="btns"><button onClick={() => { saveName(2) }} className="save-btn">Save</button><button onClick={() => { cancelName(2) }} className="cancel-btn">Cancel</button></div></div></div>
                <div className="list-detail">Password - <div><div><input className="invisible" type="text" disabled value={password} onChange={(e) => { setPassword(e.target.value) }} /> <i onClick={() => { changePassword(3) }} className="fa-solid fa-pencil pointers"></i></div><div className="btns"><button onClick={() => { savePassword(3) }} className="save-btn">Save</button><button onClick={() => { cancelPassword(3) }} className="cancel-btn">Cancel</button></div></div></div>
                <div>Profile Picture</div>
                <div className="your-dp-ctn"><img className="your-dp" src={require('../userimages/'+dp)} /><i className="fa-solid fa-circle-plus dp-c"><input type='file' onChange={(e) => { uploadImg(e) }} className="upload" /></i>
                    <div className="btn"><button onClick={() => { saveImg() }} className="save-btn">Upload</button><button onClick={() => { cancelImg() }} className="cancel-btn">Cancel</button></div>
                </div>
            </div>
        </div>
    </>)
}
function Logout() {
    const Navigate = useNavigate();
    function logout() {
        localStorage.clear();
        Navigate('/');
    }
    return (<>
        <div className="logsection">
            <div className="recent">Logout Section</div>
            <div className="logs-ctn">
                <button className="logs" onClick={logout}>Logout <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i></button>
                <button className="logs">Login as a different user <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i></button>
            </div>
        </div>
    </>)
}
export default Settings;
