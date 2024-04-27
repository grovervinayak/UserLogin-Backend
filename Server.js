const express=require('express');
const path=require('path');
const app=express();
const mongoose=require('mongoose');
const port=process.env.PORT || 3000;
const bodyParser = require("body-parser");
const mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
mongoose.connect(mongo_uri,{useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all("/*", function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});
require('./Server/Routes/userRoutes')(app);
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(__dirname));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'index.html'));

  });
}
app.listen(port);
console.log("Server Started");