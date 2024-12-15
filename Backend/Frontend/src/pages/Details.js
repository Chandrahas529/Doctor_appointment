import React, { useState ,useEffect} from 'react';
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './Details.css';
const lists = [
    { id: 1, categorie: "Neurology", No: 3 },
    { id: 2, categorie: "Opthalmology", No: 2 },
    { id: 3, categorie: "Nuclear Magnetic", No: 4 },
    { id: 4, categorie: "Surgical", No: 3 },
    { id: 5, categorie: "Cardiology", No: 1 },
    { id: 6, categorie: "X-ray", No: 5 },
    { id: 7, categorie: "Dental", No: 3 },
    { id: 8, categorie: "Traumatology", No: 2 }
]
export const Details = () => {
    const { setActive } = useOutletContext();
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:'instant'
        })
    },[])
    return (
        <div>
            <CategoriList />
            <Doctors setActive={setActive} />
        </div>
    )
}

function CategoriList() {
    const [lists,setLists] = useState([])
    async function getlist(){
        let result = await fetch('http://localhost:5000/categorie');
        result = await result.json();
        setLists(result)
    }
    useEffect(()=>{
        getlist()
    },[])
    let i = 1;
    return (
        <div className='Categ-ctn'>
            {
                lists.map((list, index) =>
                    <div key={index} className='cardCateg'>
                        <span className='idno'>{i++}</span>
                        <div className='batch'>Specialist</div>
                        <div className='categ-type'>{list.categorie}</div>
                        <div className='no-of-doc'>Number of doctors we have for this are {list.doctors}</div>
                    </div>
                )
            }
        </div>
    )
}
function Doctors({setActive}) {
    const [Doctorslist,setDoctorslist] = useState([]);
    const navigate = useNavigate();
    function handleClick(id){
        setActive(3)
        const dataToSend = {
            id:id
        };
        navigate('/appointment', { state: dataToSend });
    }
    const Doctorslists = async () =>{
         let result = await fetch('http://localhost:5000/doctorlist');
         result = await result.json();
         setDoctorslist(result);
    }
    useEffect(()=>{
        Doctorslists()
    },[])
    return (<>
    <div className='doctorlist'>
    {lists.map((lis,index) => (
        <React.Fragment key={index}>
            <div className='catelist' id={lis.categorie}>{lis.categorie}</div>
            <div className='listing'>
            {
                Doctorslist.map((doc,indexs) => {
                    if (doc.speciallistof === lis.categorie) {
                        return (
                            <div className='doctor-card' key={indexs}>
                                <div className='d-p-c'>
                                    <img className='doctor-profile' src={require(`../Doctors/${doc.src}`)} alt="Doctor Profile" />
                                </div>
                                <div className='biodata'>
                                    <div className='doctor-name'>{doc.name}</div>
                                    <span className='doctor-call'><i className="fa-solid fa-phone"></i> {doc.mobile}</span>
                                    <div className='doctor-quali'><b>Qualification -</b> {doc.qualification}</div>
                                    <div className='doctor-experi'><b>Experience -</b> {doc.experience}</div>
                                    <div className='doctor-special'><b>Specialist -</b> {doc.speciallistof}</div>
                                    <div className='doctor-lines'>{doc.about}</div>
                                </div>
                                <div className='appoin-ctn'><button onClick={() => { handleClick(doc._id)}} className='appointment'>Make an appointment</button></div>
                            </div>
                        );
                    }
                    return null; // Return null if condition is not met to avoid undefined return
                })
            }
            </div>
        </React.Fragment>
    ))}
</div>

    </>)
}
