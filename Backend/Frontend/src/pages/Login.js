import { useState } from "react";
import src1 from "../images/d.jpg"
import "../pages/login.css"
import { useNavigate } from "react-router-dom";
function Login() {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [mobile,setMobile] = useState('');
    const [gender,setGender] = useState('');
    const [password,setPwd] = useState('');
    const [iemail,setIemail] = useState('');
    const [ipassword,setIpwd] = useState('');
    const navigate = useNavigate();
     async function handleRegister(){
        let src = '';
        let result = await fetch('http://localhost:5000/register',{
            method:"post",
            body:JSON.stringify({name,email,mobile,gender,password,src}),
            headers:{
                "Content-Type":'application/json'
            }
        })
       result = await result.json();
        localStorage.setItem('user',JSON.stringify(result));
        navigate('/'); 
    }
    async function handleLogin(){
        let result = await fetch('http://localhost:5000/login',{
            method:'post',
            body:JSON.stringify({email:iemail,password:ipassword}),
            headers:{'Content-Type':'application/json'}
        })
        result = await result.json();
        console.log(result)
        if(result.name){
            localStorage.setItem('user',JSON.stringify(result))
            navigate('/')
        }
        else{
            alert("Please enter the correct details")
        }
    }
    return (
        <div className="outer-ctn">
            <div className="inner-ctn">
                <img className="login-img" src={src1} />
                <div className="login-sec">
                    <div className="c1" id="c1">
                        <span className="log">Login</span>
                        <div className="login-form">
                            <div className="c2"><label>Email</label><br /><input value={iemail} onChange={(e)=>{setIemail(e.target.value)}} className="text" type="text" /></div>
                            <div className="c2"><label>Password</label><br /><input value={ipassword} onChange={(e)=>{setIpwd(e.target.value)}} className="text" type="text" /></div>
                            <button onClick={handleLogin} className="login-btn">Login</button>
                            <div style={{ color: "black" }}>or</div>
                            <span onClick={register}>Register as a new User</span>
                        </div>
                    </div>
                    <div className="c12" id="c12">
                        <span className="log2">Register</span>
                        <div className="login-form2">
                            <div className="c2"><label>Name</label><br /><input value={name} onChange={(e)=>{setName(e.target.value)}} className="text" type="text" /></div>
                            <div className="c2"><label>Email</label><br /><input value={email} onChange={(e)=>{setEmail(e.target.value)}} className="text" type="text" /></div>
                            <div className="c2"><label>Mobile Number</label><br /><input value={mobile} onChange={(e)=>{setMobile(e.target.value)}} className="text" type="text" /></div>
                            <div className="c21"><label>Gender</label><div className="inline"><input value='male' onChange={(e)=>{setGender(e.target.value)}} name="gender" className="text" id="male" type="radio"/><label for="male"> Male</label></div><div className="inline"><input id="female" value="female" onChange={(e)=>{setGender(e.target.value)}} name="gender" className="text" type="radio" /><label for="female"> Female</label></div></div>
                            <div className="c2"><label>Create Password</label><br /><input value={password} onChange={(e)=>{setPwd(e.target.value)}} className="text" type="text" /></div>
                            <button onClick={handleRegister} className="login-btn">Submit</button>
                            <div style={{ color: "black" }}>or</div>
                            <span  onClick={loginbtn}>Already have an account</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function register(){
    var c1 = document.getElementById('c1')
    var c12 = document.getElementById('c12')
    c1.style.display = "none";
    c12.style.display = "flex";
}
function loginbtn(){
    var c1 = document.getElementById('c1')
    var c12 = document.getElementById('c12')
    c1.style.display = "flex";
    c12.style.display = "none";
}

export default Login;