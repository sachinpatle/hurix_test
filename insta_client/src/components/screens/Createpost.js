import React, { useEffect, useState } from 'react'
import M from 'materialize-css';
import { Link ,useHistory} from 'react-router-dom';
function Createpost() {
    const history =useHistory();
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");

    const ontitleChange=async(e)=>{
        const title = e.target.value;
        setTitle(title);
    };

    
    const onbodyChange=async(e)=>{
        const body = e.target.value;
        setBody(body);
    };

    const onImageChange=async(e)=>{
        const image = e.target.files[0];
        console.log(image)
        setImage(image);
    };
    
            useEffect(()=>{
            if(url)
            {
                SavetodataBase()
            }

            },[url])

    const postImageToCloud=async()=>{
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
            // SavetodataBase()
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const SavetodataBase=()=>{
        fetch("http://localhost:5000/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
          if(data.error)
          {
            M.toast({html: data.error,classes:"red"})
          }
          else{
              M.toast({html :"created post Successfully",classes:"green"})
              history.push('/')
          }
        })
        .catch(err=>{
            console.log(err)
        
        })
    }



    return (
        <div className="createpost">
        <div className="card createpost_file">
        <input type="text" placeholder="title" 
            value={title} onChange={ontitleChange}
        />
        <input type="text" placeholder="body" value={body}
        onChange={onbodyChange} />

        <div className="file-field input-field">

            <div className="btn">
                <span>Upload pic</span>
                <input type="file" 
                    onChange={onImageChange}
                />
            </div>

            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
    </div>
    <button onClick={postImageToCloud} className="btn createpost_button">Submit
    </button>

        
        </div>
            
        </div>
    )
}

export default Createpost
