const mongoose=require('mongoose');
const {mongourl}=require('../config/keys')
// const mongourl = "mongodb+srv://sachin:qTpQY77yUeKWhKCn@cluster0.er3o6.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose.connect(mongourl,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:true,
}).then(()=>{
    console.log("connected to the mongoose");
}).catch((error)=>
{
    console.log(error);
})
