import React,{useContext, useEffect,useState} from 'react'
import { usercontext } from '../../App'
import {useParams} from 'react-router-dom'

function UserProfile() {
    const [userProfile,setuserProfile] =useState(null)
    const {state,dispatch} =useContext(usercontext)
    const {userid} = useParams()
    const [showfollow,setshowfollow] =useState(state?!state.following.includes(userid):true)
    console.log(userid)

    useEffect(() => {
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setuserProfile(result)
        })
    }, [])

    const followuser = ()=>{
        // console.log(userid)
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
                
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))  
            setuserProfile((prevstate)=>{

                return {
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:[...prevstate.user.followers,data._id]
                    }
                }
            })
            setshowfollow(false);
        })
    }

    
    const unfollowuser = ()=>{
        // console.log(userid)
        fetch("/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))  
            setuserProfile((prevstate)=>{
const newfollower =prevstate.user.followers.filter(item=>item != data._id)
                return {
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:newfollower
                    }
                }
            })
            setshowfollow(true);
        })
    }

    return (

        <>
        { userProfile ? 
            <div className="profile">
       <div className="profile_inside">
       <div className="profile_avartar">
<img className="profile_avartar_img" 
  src={userProfile.user.pic}/>
       </div>
       <div className="profile_info">
           <h4>{userProfile.user.name}</h4>
           <h4>{userProfile.user.email}</h4>
           <div className="profile_postinfo">
           <h6>{userProfile.posts.length}posts</h6>
           <h6>{userProfile.user.followers.length}followers</h6>
           <h6>{userProfile.user.following.length}following</h6>
           {
               showfollow?<button onClick={followuser} className="btn waves-effect waves-light ">Follow
           </button>:<button onClick={unfollowuser} className="btn waves-effect waves-light ">UnFollow
                </button>
           } 
           </div>
       </div>
</div>

<div className="profile_galary">
{
    userProfile.posts.map(item=>{
        return(
            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
        )
    })
}

</div>
</div> 
        
         :<h4>Loading...</h4> }
      
</>
    )
}

export default UserProfile
