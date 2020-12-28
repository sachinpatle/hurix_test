
import {React,useContext,useEffect,useState} from 'react'
import {usercontext} from '../../App'
import {Link} from 'react-router-dom';

function Home() {
    const [data,setData]= useState([])
    const {state} = useContext(usercontext)
    useEffect(()=>{
        fetch("/following_user_post",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.posts)
        })
    },[])

    const makecomment =(text,postId)=>{
        fetch("/comment",{

            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt") 
            },
            body:
                JSON.stringify({
                    postId,
                    text
                })
            
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData= data.map(item=>{
                if(item._id === result._id)
                {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })




    }

    const likepost = (id)=>{
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData= data.map(item=>{
                if(item._id === result._id)
                {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
    })
    .catch(err=>{
        console.log(err)
    })
    }


    const unlikepost = (id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
            })
            .then(res=>res.json())
            .then(result=>{
                const newData= data.map(item=>{
                    if(item._id === result._id)
                    {
                        return result
                    }
                    else{
                        return item
                    }
                })
                setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

   

    const  deletecomment =(postid,commentid)=>{
        fetch("/deletecomment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postid,
                commentId:commentid
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData= data.map(item=>{
                if(item._id === result._id)
                {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
       })
            .catch(err=>{
                console.log(err)
            })

    }

    const  deletepost =(postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData= data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })

    }
    
    return (
        <div className="home">
        
        {
            data.map(item=>{

                return(
                    <div className="card home_card">

                <h5><Link to={ item.postedBy._id !== state._id ?"/user/"+item.postedBy._id:"/profile"}>{item.postedBy.name}</Link> 

                {
                    item.postedBy._id === state._id && <i className="material-icons card_deletepost" onClick={()=>deletepost(item._id)}>delete</i>
                }
              
                </h5>

                <div className="card-image">
                    <img src={item.photo}></img>
                </div>
                <div className="card-content">
                <i className="material-icons">favorite</i>
                {
                    item.likes.includes(state._id)?<i onClick={()=>{unlikepost(item._id)}} className="material-icons">thumb_down</i>
                    :
                    <i onClick={()=>{likepost(item._id)}} className="material-icons">thumb_up</i>    
                }
                    <h6>{item.likes.length} likes</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>
                    {
                        item.comments.map(record=>{
                            return(
                                <h6><span><b> {record.postedBy.name}</b></span>{record.text} 
                                {
                                    record.postedBy._id === state._id && <i className="material-icons card_deletecomment" onClick={()=>deletecomment(item._id,record._id)}>delete</i>
                                    }
                                </h6>
                               
                            )
                        })
                    }
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                    makecomment(e.target[0].value,item._id)
                    }}>
                    <input type="text" placeholder="add a comment" />
                    </form>
                    
                </div>
            </div>

                )
            })
        }
            
            </div>
    )
}

export default Home
