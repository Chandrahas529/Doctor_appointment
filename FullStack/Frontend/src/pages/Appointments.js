import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Appointments.css'
import { useState } from "react";
function Appoinments() {
    const location = useLocation();
    const dataReceived = location.state || { id: "668a93883e776aba28035b0e" };
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:'instant'
        })
    },[])
    var n = 1;
    if (dataReceived != "") {
        n = dataReceived.id;
    }
    else {
        n = 1;
    }
    const [selecteddoctor, setSelectedDoctor] = useState(n);
    return (
        <div className="appoint-ctn">
            <Leftlist selectdoc={setSelectedDoctor} />
            <Rightlist ids={selecteddoctor} />
        </div>
    )
}

function Leftlist({ selectdoc }) {
    const [search, setSearch] = useState('');
    const [Doctorslist, setDoctorslist] = useState([]);
    const [list, setList] = useState();
    useEffect(() => {
        Doctorlists();
    }, [])
    const Doctorlists = async () => {
        let result = await fetch('http://localhost:5000/doctorlist');
        result = await result.json();
        setDoctorslist(result);
    }
    const scrol = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    const updatelist = () => {
        if (search === '') {
            // Show all doctors if the search term is empty
            setList(Doctorslist.map(doc => (
                <div key={doc._id} className="appoint-card">
                    <div className="profile-ctn">
                        <img className="profile-pic" src={require(`../Doctors/${doc.src}`)} />
                    </div>
                    <div className="small-bio">
                        <div className="d-name">{doc.name}</div>
                        <div>Specialist - {doc.speciallistof}</div>
                        <button onClick={() => { selectdoc(doc._id); scrol() }} className="appo">Make an appointment</button>
                    </div>
                </div>
            )));
        } else {
            // Filter the list based on the search term
            const filtered = Doctorslist.filter(doc =>
                doc.name.toLowerCase().includes(search.toLowerCase()) ||
                doc.speciallistof.toLowerCase().includes(search.toLowerCase())
            ).map(doc => (
                <div key={doc.id} className="appoint-card">
                    <div className="profile-ctn">
                        <img className="profile-pic" src={require(`../Doctors/${doc.src}`)} />
                    </div>
                    <div className="small-bio">
                        <div className="d-name">{doc.name}</div>
                        <div>Specialist - {doc.speciallistof}</div>
                        <button onClick={() => { selectdoc(doc._id); scrol() }} className="appo">Make an appointment</button>
                    </div>
                </div>
            ));
            setList(filtered);
        }
    }
    useEffect(() => {
        updatelist()
    }, [search, Doctorslist])
    return (
        <div className="left-ctn">
            <div className="searchctn"><input onChange={(e) => { setSearch(e.target.value) }} className="search-input" type="text" placeholder="Search here..." /></div>
            <div className="leftlist">
                {list}
            </div>
        </div>
    );
}

function Rightlist(ids) {
    const [dName, setDname] = useState('');
    const [dId, setDid] = useState('');
    return (<div className="rightlist">
        <SelectedDoctor idc={ids.ids} dName={setDname} dId={setDid} />
        <Selecttime dName={dName} dId={dId} />
    </div>)
}

function SelectedDoctor({ idc, dName, dId }) {
    const [Doctorslists, setDoc] = useState('');
    const [img, setImg] = useState('doc1.jpeg')
    useEffect(() => {
        getDetail();
    }, [idc]);
    async function getDetail() {
        let result = await fetch('http://localhost:5000/doctordetails/' + idc);
        result = await result.json();
        setDoc(result)
        let Img = await result.src
        setImg(Img)
    }
    dName(Doctorslists.name);
        dId(Doctorslists._id);
    return (<div className="selected-doctor">
        <div className="selected-bio">
            <div className="selected-name">Make an appoinment with <b>{Doctorslists.name}</b></div>
            <div>Specialist - <b>{Doctorslists.speciallistof}</b></div>
            <div>experience - {Doctorslists.experience}</div>
            <div><i className="fa-solid fa-phone"></i> {Doctorslists.mobile}</div>
        </div>
        <div className="s-p-c"><img className="selected-pic" src={require('../Doctors/' + img)} alt={Doctorslists.src} /></div>
    </div>);
}

function Selecttime({ dName, dId }) {
    const [date, setDate] = useState(new Date);
    const [selectedDate, setSelectedDate] = useState(date);
    const [period, setPeriod] = useState('Select the time slot');
    const [bdate, setBdate] = useState('');
    const [d, setD] = useState('');

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getNextDate = (currentDate, daysToAdd) => {
        let newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + daysToAdd);
        return newDate;
    };

    const handleDateSelection = (daysToAdd) => {
        const newSelectedDate = getNextDate(date, daysToAdd);
        setSelectedDate(newSelectedDate);
        setTimeout(see, 100);
    };

    const formatDate = (date) => {
        return `${date.getDate()} ${daysOfWeek[date.getDay()]}, ${monthsOfYear[date.getMonth()]} ${date.getFullYear()}`;
    };
    useEffect(() => { see() }, []);
    function see() {
        const ctn = document.getElementById('date').innerText;
        setD(ctn)
    }

    return (
        <div>
            <div className="select-tctn">
                <div className="dates">
                    <div className="d-c">
                        <input
                            className="s-date"
                            type="radio"
                            name="date"
                            onClick={() => handleDateSelection(0)}
                            defaultChecked={true}
                        />
                        <span className="date">{date.getDate()}</span>
                    </div>
                    <div className="d-c">
                        <input
                            className="s-date"
                            type="radio"
                            name="date"
                            onClick={() => handleDateSelection(1)}
                        />
                        <span className="date">{getNextDate(date, 1).getDate()}</span>
                    </div>
                    <div className="d-c">
                        <input
                            className="s-date"
                            type="radio"
                            name="date"
                            onClick={() => handleDateSelection(2)}
                        />
                        <span className="date">{getNextDate(date, 2).getDate()}</span>
                    </div>
                </div>
                <div className="day" id="date">{formatDate(selectedDate)}</div>
            </div>
            <div className="s-ctn">
                <div className="border-bot">
                    <Boxes />
                    <Morning timer={setPeriod} dt={d} dId={dId} />
                    <Afternoon timer={setPeriod} dt={d} dId={dId} />
                    <Evening timer={setPeriod} dt={d} dId={dId} />
                </div>
                <PatientForm bdate={bdate} dId={dId} dName={dName} timer={period} />
            </div>
        </div>
    );
}


function Boxes() {
    return (
        <div>
            <h3>Select the time slot</h3>
            <div className="boxes">
                <span className="booked">Not available</span>
                <span className="bookedbyyou">Booked by you</span>
                <span className="duration">Available</span>
                <span className="tobeselect">Selected</span>
            </div>
        </div>
    )
}

function Morning({ timer, dt, dId }) {
    const [tm, setTm] = useState(new Date())
    useEffect(() => {
        const interval = setInterval(() => {
            setTm(new Date());
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    const t = dt.split(' ')[0];
    const Mschedule = [
        { id: 1, duration: "9:00-9:15", sh: 9, sm: 0 },
        { id: 2, duration: "9:15-9:30", sh: 9, sm: 15 },
        { id: 3, duration: "9:30-9:45", sh: 9, sm: 30 },
        { id: 4, duration: "9:45-10:00", sh: 9, sm: 45 },
        { id: 5, duration: "10:00-10:15", sh: 10, sm: 0 },
        { id: 6, duration: "10:15-10:30", sh: 10, sm: 15 },
        { id: 7, duration: "10:30-10:45", sh: 10, sm: 30 },
        { id: 8, duration: "10:45-11:00", sh: 10, sm: 45 },
        { id: 9, duration: "11:00-11:15", sh: 11, sm: 0 },
        { id: 10, duration: "11:15-11:30", sh: 11, sm: 15 },
        { id: 11, duration: "11:30-11:45", sh: 11, sm: 30 },
        { id: 12, duration: "11:45-12:00", sh: 11, sm: 45 }
    ]
    const [slot, setSlot] = useState([]);
    let userid = localStorage.getItem('user');
    if (userid) {
        userid = JSON.parse(userid)._id;
    }
    else {
        userid = 'unknown';
    }
    useEffect(() => { slots() }, [dId, dt])
    async function slots() {
        let result = await fetch('http://localhost:5000/slots', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: dt, doctorId: dId })
        })
        result = await result.json();
        setSlot(result);
    }
    return (
        <div>
            <h3>Morning Slot</h3>
            <div className="timing">
                {Mschedule.map((dur) => {
                    let bookedby = '';
                    let booked = false;
                    if (slot.length > 0) {
                        for (let i = 0; i < slot.length; i++) {
                            if (dur.duration === slot[i].timing) {
                                if (slot[i].isBooked === false) {
                                    bookedby = "duration";
                                    booked = false;
                                    break;
                                }
                                if (userid === slot[i].userId) {
                                    bookedby = "bookedbyyou";
                                    booked = true;
                                    break;
                                }
                                else {
                                    bookedby = "booked";
                                    booked = true;
                                    break;
                                }
                            }
                            else {
                                if (t === tm.getDate().toString()) {
                                    if (tm.getHours() > dur.sh) {
                                        bookedby = "booked";
                                        booked = true;
                                    }
                                    else if (tm.getHours() === dur.sh && tm.getMinutes() >= dur.sm) {
                                        bookedby = "booked";
                                        booked = true;
                                    }
                                    else {
                                        bookedby = "duration";
                                        booked = false;
                                    }
                                }
                                else {
                                    bookedby = "duration";
                                    booked = false;
                                }
                            }
                        }
                    }
                    else {
                        if (t === tm.getDate().toString()) {
                            if (tm.getHours() > dur.sh) {
                                bookedby = "booked";
                                booked = true;
                            }
                            else if (tm.getHours() === dur.sh && tm.getMinutes() >= dur.sm) {
                                bookedby = "booked";
                                booked = true;
                            }
                            else {
                                bookedby = "duration";
                                booked = false;
                            }
                        }
                        else {
                            bookedby = "duration";
                            booked = false;
                        }
                    }
                    return (
                        <div key={dur.id}>
                            <div className="abs">
                                <input onClick={() => { timer(dur.duration) }} disabled={booked ? true : false} className="hidden" name="duration" type="radio" />
                                <span className={bookedby}>{dur.duration}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    )
}

function Afternoon({ timer, dt, dId }) {
    const [tm, setTm] = useState(new Date())
    useEffect(() => {
        const interval = setInterval(() => {
            setTm(new Date());
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    const t = dt.split(' ')[0];
    const Aschedule = [
        { id: 1, duration: "1:00-1:15", sh: 13, sm: 0 },
        { id: 2, duration: "1:15-1:30", sh: 13, sm: 15 },
        { id: 3, duration: "1:30-1:45", sh: 13, sm: 30 },
        { id: 4, duration: "1:45-2:00", sh: 13, sm: 45 },
        { id: 5, duration: "2:00-2:15", sh: 14, sm: 0 },
        { id: 6, duration: "2:15-2:30", sh: 14, sm: 15 },
        { id: 7, duration: "2:30-2:45", sh: 14, sm: 30 },
        { id: 8, duration: "2:45-3:00", sh: 14, sm: 45 },
        { id: 9, duration: "3:00-3:15", sh: 15, sm: 0 },
        { id: 10, duration: "3:15-3:30", sh: 15, sm: 15 },
        { id: 11, duration: "3:30-3:45", sh: 15, sm: 30 },
        { id: 12, duration: "3:45-4:00", sh: 15, sm: 45 }
    ]

    const [slot, setSlot] = useState([]);
    let userid = localStorage.getItem('user');
    if (userid) {
        userid = JSON.parse(userid)._id;
    }
    else {
        userid = 'unknown';
    }
    useEffect(() => { slots() }, [dId, dt])
    async function slots() {
        let result = await fetch('http://localhost:5000/slots', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: dt, doctorId: dId })
        })
        result = await result.json();
        setSlot(result);
    }
    return (
        <div>
            <h3>Afternoon Slot</h3>
            <div className="timing">
                {Aschedule.map((dur) => {
                    let bookedby = '';
                    let booked = false;
                    if (slot.length > 0) {
                        for (let i = 0; i < slot.length; i++) {
                            if (dur.duration === slot[i].timing) {
                                if (slot[i].isBooked === false) {
                                    bookedby = "duration";
                                    booked = false;
                                    break;
                                }
                                if (userid === slot[i].userId) {
                                    bookedby = "bookedbyyou";
                                    booked = true;
                                    break;
                                }
                                else {
                                    bookedby = "booked";
                                    booked = true;
                                    break;
                                }
                            }
                            else {
                                if (t === tm.getDate().toString()) {
                                    if (tm.getHours() > dur.sh) {
                                        bookedby = "booked";
                                        booked = true;
                                    }
                                    else if (tm.getHours() === dur.sh && tm.getMinutes() >= dur.sm) {
                                        bookedby = "booked";
                                        booked = true;
                                    }
                                    else {
                                        bookedby = "duration";
                                        booked = false;
                                    }
                                }
                                else {
                                    bookedby = "duration";
                                    booked = false;
                                }
                            }
                        }
                    }
                    else {
                        if (t === tm.getDate().toString()) {
                            if (tm.getHours() > dur.sh) {
                                bookedby = "booked";
                                booked = true;
                            }
                            else if (tm.getHours() === dur.sh && tm.getMinutes() >= dur.sm) {
                                bookedby = "booked";
                                booked = true;
                            }
                            else {
                                bookedby = "duration";
                                booked = false;
                            }
                        }
                        else {
                            bookedby = "duration";
                            booked = false;
                        }
                    }
                    return (
                        <div key={dur.id}>
                            <div className="abs">
                                <input onClick={() => { timer(dur.duration) }} disabled={booked ? true : false} className="hidden" name="duration" type="radio" />
                                <span className={bookedby}>{dur.duration}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    )
}

function Evening({ timer, dt, dId }) {
    const [tm, setTm] = useState(new Date())
    useEffect(() => {
        const interval = setInterval(() => {
            setTm(new Date());
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    const t = dt.split(' ')[0];
    const Eschedule = [
        { id: 1, duration: "6:00-6:15", sh: 18, sm: 0 },
        { id: 2, duration: "6:15-6:30", sh: 18, sm: 15 },
        { id: 3, duration: "6:30-6:45", sh: 18, sm: 30 },
        { id: 4, duration: "6:45-7:00", sh: 18, sm: 45 },
        { id: 5, duration: "7:00-7:15", sh: 19, sm: 0 },
        { id: 6, duration: "7:15-7:30", sh: 19, sm: 15 },
        { id: 7, duration: "7:30-7:45", sh: 19, sm: 30 },
        { id: 8, duration: "7:45-8:00", sh: 19, sm: 45 },
        { id: 9, duration: "8:00-8:15", sh: 20, sm: 0 },
        { id: 10, duration: "8:15-8:30", sh: 20, sm: 15 },
        { id: 11, duration: "8:30-8:45", sh: 20, sm: 30 },
        { id: 12, duration: "8:45-9:00", sh: 20, sm: 45 }
    ]


    const [slot, setSlot] = useState([]);
    let userid = localStorage.getItem('user');
    if (userid) {
        userid = JSON.parse(userid)._id;
    }
    else {
        userid = 'unknown';
    }
    useEffect(() => { slots() }, [dId, dt])
    async function slots() {
        let result = await fetch('http://localhost:5000/slots', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: dt, doctorId: dId })
        })
        result = await result.json();
        setSlot(result);
    }
    return (
        <div>
            <h3>Evening Slot</h3>
            <div className="timing">
                {Eschedule.map((dur) => {
                    let bookedby = '';
                    let booked = false;
                    if (slot.length > 0) {
                        for (let i = 0; i < slot.length; i++) {
                            if (dur.duration === slot[i].timing) {
                                if (slot[i].isBooked === false) {
                                    if (t === tm.getDate().toString()) {
                                        if (tm.getHours() > dur.sh) {
                                            bookedby = "booked";
                                            booked = true;
                                            break;
                                        }
                                        else if (tm.getHours() === dur.sh && tm.getMinutes() >= dur.sm) {
                                            bookedby = "booked";
                                            booked = true;
                                            break;
                                        }
                                        else {
                                            bookedby = "duration";
                                            booked = false;
                                            break;
                                        }
                                    }
                                    else {
                                        bookedby = "duration";
                                        booked = false;
                                        break;
                                    }
                                }
                                if (userid === slot[i].userId) {
                                    bookedby = "bookedbyyou";
                                    booked = true;
                                    break;
                                }
                                else {
                                    bookedby = "booked";
                                    booked = true;
                                    break;
                                }
                            }
                            else {
                                if (t === tm.getDate().toString()) {
                                    if (tm.getHours() > dur.sh) {
                                        bookedby = "booked";
                                        booked = true;
                                        break;
                                    }
                                    else if (tm.getHours() === dur.sh && tm.getMinutes() >= dur.sm) {
                                        bookedby = "booked";
                                        booked = true;
                                        break;
                                    }
                                    else {
                                        bookedby = "duration";
                                        booked = false;
                                        break;
                                    }
                                }
                                else {
                                    bookedby = "duration";
                                    booked = false;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        if (t === tm.getDate().toString()) {
                            if (tm.getHours() > dur.sh) {
                                bookedby = "booked";
                                booked = true;
                            }
                            else if (tm.getHours() === dur.sh && tm.getMinutes() >= dur.sm) {
                                bookedby = "booked";
                                booked = true;
                            }
                            else {
                                bookedby = "duration";
                                booked = false;
                            }
                        }
                        else {
                            bookedby = "duration";
                            booked = false;
                        }
                    }
                    return (
                        <div key={dur.id}>
                            <div className="abs">
                                <input onClick={() => { timer(dur.duration) }} disabled={booked ? true : false} className="hidden" name="duration" type="radio" />
                                <span className={bookedby}>{dur.duration}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    )
}

function PatientForm({ bdate, dId, dName, timer }) {
    const navigate = useNavigate();
    const [pName, setPname] = useState('');
    const [pAge, setPage] = useState('');
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date();
    date = (date.getDate() + " " + monthsOfYear[date.getMonth()] + " " + date.getFullYear())
    async function bookslot() {
        const auth = localStorage.getItem('user');
        const d = document.getElementById('date').innerText;
        if (auth) {
            if (pAge != "" && pName != "" && timer != "Select the time slot") {
                let result = await fetch('http://localhost:5000/appointment', {
                    method: 'post',
                    body: JSON.stringify({
                        userId: JSON.parse(auth)._id,
                        doctorId: dId,
                        doctorName: dName,
                        pName: pName,
                        pAge: pAge,
                        timing: timer,
                        date: d,
                        bookedOn: date,
                        status: "Pending",
                        isBooked: true
                    }),
                    headers: { 'Content-Type': 'application/json' }
                })
                result = await result.json();
                navigate('/settings');
            }
        }
        else {
            navigate('/login');
        }
    }
    return (<div className="form-ctn">
        <div className="form">
            <div><label>Patient Name - </label><input type="text" value={pName} onChange={(e) => { setPname(e.target.value) }} /></div>
            <div><label>Patient Age - </label><input type="text" value={pAge} onChange={(e) => { setPage(e.target.value) }} /></div>
            <div><label>Selected Time Period - </label><input style={{ textAlign: "center" }} value={timer} disabled type="text" /></div>
            <div style={{ display: "flex", alignItems: "center" }}><button onClick={bookslot}>Complete the Process</button></div>
        </div>
    </div>);
}

export default Appoinments;