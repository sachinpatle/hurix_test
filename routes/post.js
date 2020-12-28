const express=require('express');
const router =express.Router()
const mongoose=require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post =mongoose.model("Post");

router.get("/mypost",requireLogin,(req,res)=>{
Post.find({postedBy:req.user._id})
.populate("postedBy","_id name")
.then(mypost=>{
    res.json({mypost})
})
.catch(err=>{
    console.log(err)
})
 })

router.get("/allpost",requireLogin,(req,res)=>{
     Post.find()
     .populate("postedBy","_id name")
     .populate("comments.postedBy","_id name")
     .sort('-createdAt')
    .then(posts=>{
        res.send({posts});
    })
    .catch(err=>{
        console.log(err);
    })
})


router.get("/following_user_post",requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
   .then(posts=>{
       res.send({posts});
   })
   .catch(err=>{
       console.log(err);
   })
})


router.post("/createpost",requireLogin,(req,res)=>{
    const {title,body,pic} = req.body;
    console.log(title,body,pic);
    if(!title || !body ||!pic)
    {
        return res.status(422).json({error:"please add all the fields"})
    }
    console.log(req.user)
const post=new  Post({
    title,
    body,
    photo:pic,
    postedBy:req.user
})
console.log(post);
post.save().then(result=>{
    res.json({post:result})
})
.catch(err=>{
    console.log(err);
})
})

router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },
    {
    new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err)
        {
            return res.status(400).json({error:err})
        }
        else{
            res.json(result);
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },
    {
    new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err)
        {
            return res.status(400).json({error:err})
        }
        else{
            res.json(result);
        }
    })
})

router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString())
        {
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }

    })
})


// router.delete("/deletecomment/:postId/:commentId",requireLogin,(req,res)=>{
//     Post.findOne({_id:req.params.postId})
//     .exec((err,post)=>{
//         if(err || !post){
//             return res.status(422).json({error:err})
//         }
//         if(post.postedBy._id.toString() === req.user._id.toString())
//         {
//             post.comments.delete({_id : req.params.commentId})
//             .then(result=>{
//                 res.json(result)
//             }).catch(err=>{
//                 console.log(err)
//             })
//         }

//     })
// })


router.put("/deletecomment",requireLogin,(req,res)=>{
    console.log(req.body.postId,req.body.commentId)
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:{_id :req.body.commentId}}
    },
    {
    new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err)
        {
            return res.status(400).json({error:err})
        }
        else{
            res.json(result);
            console.log(result)
        }
    })
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    }, 
    {
    new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{ 
        if(err)
        {
            return res.status(400).json({error:err})
        }
        else{
            res.json(result);
        }
    })
})
module.exports =  router
