import {React,useState,useContext} from 'react'
import { Link ,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {usercontext} from '../../App'
function Login() {
    const {state,dispatch} = useContext(usercontext)
    const history =useHistory();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [firstname,setfirstname] = useState("");
    const [lastname,setlastname] = useState("");
    const [dob,setdob] = useState("");

    const onemailChange=async(e)=>{
        const email = e.target.value;
        setEmail(email);
    };

    
    const onpasswordChange=async(e)=>{
        const password = e.target.value;
        setPassword(password);
    };

    const onfirstnameChange=async(e)=>{
        const firstname = e.target.value;
        setfirstname(firstname);
    };

    const onlastnameChange=async(e)=>{
        const lastname = e.target.value;
        setlastname(lastname);
    };

    const ondobChange=async(e)=>{
        const dob = e.target.value;
        setdob(dob);
    };

    const PostData = async()=>{
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
        {
            M.toast({html: "Invalid email",classes:"red"})
            return
        }
        fetch("http://localhost:5000/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email,
                firstname,
                lastname,
                dob

            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
          if(data.error)
          {
            M.toast({html: data.error,classes:"red"})
          }
          else{
              localStorage.setItem("jwt",data.token);
              localStorage.setItem("user",JSON.stringify(data.user));
              dispatch({type:"USER",payload:data.user})
              M.toast({html :"Signed in Successfully",classes:"green"})
              history.push('/')
          }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="login">
            <div className="card loginCard">
                <h2 className="login_text_insta">Instagram</h2>

                <input type="text" placeholder="email" 
                value={email} onChange={onemailChange}
            />

               <input type="text" placeholder="email" 
                value={firstname} onChange={onfirstnameChange}
            />
             <input type="text" placeholder="last name" 
                value={lastname} onChange={onlastnameChange}
            />
             <input type="text" placeholder="DOB" 
                value={dob} onChange={ondobChange}
            />

            <input type="password" placeholder="password"
            value={password} onChange={onpasswordChange} />
            
                <br></br> <br></br> <br></br>
                <button onClick={PostData} className="btn waves-effect waves-light">Login
            </button>
                <h5 className="login_text">
                <Link to="/signup">Don't  have an account?</Link>
            </h5>
            </div>
        </div>
    )
}
export default Login
