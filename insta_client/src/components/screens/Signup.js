import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import {useState} from 'react';
import M from 'materialize-css';

function Signup() {
    const history =useHistory();
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);

    useEffect(()=>{
            if(url)
             {
                  UploadFieledWithoutProfile()
              }
          },[url])

    
    const UploadProfilePicToCloud=async()=>{
        const data= new FormData();
        data.append("file",image)
        data.append('upload_preset',"insta-clone")
        data.append("cloud_name","sachininstaclone");
       await  fetch("https://api.cloudinary.com/v1_1/sachininstaclone/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
            .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const UploadFieledWithoutProfile=()=>{
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
        {
            M.toast({html: "Invalid email",classes:"red"})
            return
        }
        fetch("http://localhost:5000/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
          if(data.error)
          {
            M.toast({html: data.error,classes:"red"})
          }
          else{
              M.toast({html :data.message,classes:"green"})
              history.push('/login')
          }
        })
        .catch(err=>{
        M.toast({html: "got this error" +err,classes:"red"})
        })
    }


    const onemailChange=async(e)=>{
        const email = e.target.value;
        setEmail(email);
    };

    const onImageChange=async(e)=>{
        const image = e.target.files[0];
        console.log(image)
        setImage(image);
    };

    const onnameChange=async(e)=>{
        const name = e.target.value;
        setName(name);
    };

    const onpasswordChange=async(e)=>{
        const password = e.target.value;
        setPassword(password);
    };

    const PostData = async()=>{
        if(image)
        {
            UploadProfilePicToCloud()
        }
        else{UploadFieledWithoutProfile()}
       }
    return (
        <div className="signup">
        <div className="card signupcard">
            <h2 className="login_text_insta">Instagram</h2>
            <input type="text" placeholder="email" 
                value={email} onChange={onemailChange}
            />

            <input type="password" placeholder="password"
            value={password} onChange={onpasswordChange} />

            <input type="text" placeholder="name"  value={name}
            onChange={onnameChange} />

            <div className="file-field input-field">

            <div className="btn">
                <span>Upload Profile Pic</span>
                <input type="file" 
                    onChange={onImageChange}
                />
            </div>

            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>


            <button onClick={PostData} className="btn waves-effect waves-light">Sign up
            </button>

            <h5 className="login_text">
                <Link to="/login">Already have an account?</Link>
            </h5>

        </div>

    </div>
    )
}

export default Signup
