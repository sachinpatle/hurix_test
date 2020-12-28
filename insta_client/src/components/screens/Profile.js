import React,{useContext, useEffect,useState} from 'react'
import { usercontext } from '../../App'
function Profile() {
    const [mypics,setPics] =useState([])
    const {state,dispatch} =useContext(usercontext)
    const [image,setImage] = useState("");
    useEffect(() => {
        fetch("/mypost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    }, [])

    useEffect(()=>{
        if(image)
        {
            const data= new FormData();
            data.append("file",image)
            data.append('upload_preset',"insta-clone")
            data.append("cloud_name","sachininstaclone");
            fetch("https://api.cloudinary.com/v1_1/sachininstaclone/image/upload",{
                method:"post",
                body:data
            })
            .then(res=>res.json())
                .then(data=>{
                console.log(data)
                fetch("/updatepic",{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                })
                    .then(res=>res.json())
                    .then(result=>{
                        console.log(result)
                         localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                         dispatch({type:"UPDATEPIC",payload:result.pic})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[image])

    const UpdateProfile=async(e)=>{
        const image = e.target.files[0];
        console.log(image)
        setImage(image);
    };

    return (
       <div className="profile">
       <div className="profile_inside">
       <div className="profile_avartar">
<img className="profile_avartar_img" 
src={state?state.pic:"loading..."}/>

       </div>
       <div className="profile_info">
           <h4>{state?state.name:"loading"}</h4>
           <h4>{state?state.email:"loading"}</h4>
           <div className="profile_postinfo">
           <h6>{mypics.length} posts</h6>
           <h6>{state?state.followers.length:0}followers</h6>
           <h6>{state?state.following.length:0}following</h6>
           </div>
       </div>
       
</div>
            <div className="file-field input-field">
            <div className="btn">
                <span>Update Profile pic</span>
                <input type="file" 
                    onChange={UpdateProfile}
                />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>

<div className="profile_galary">  
{
    mypics.map(item=>{
        return(
            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
        )
    })
}
</div>
</div>
    )
}

export default Profile
