const express =require('express');
var cors = require('cors')
const app =express();
app.use(cors());
const PORT=process.env.PORT || 5000;

require("./conn/conn");
require("./models/user");
require("./models/post");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

// app.use(customMiddleware);

if(process.env.NODE_ENV=="production")
{
    app.use(express.static('insta_client/build'))
    const path =require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'insta_client','build','index.html'))
    })
}
app.listen(PORT,()=>{ 
    console.log("server is listining");
})

