const mongoose=require('mongoose');
var User = require("../Models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = app => {

	var user_data = {
		kind: "",
		domain: "localhost:3000", 
		url: "",
		title: "",
		description: "",
		legalName: "",
		organization: "Anonymous",
		project: "User Login",
		license: "ISC",
		author: "Vinayak Grover"
	};

	app.post("/api/v1/usersignup",(req,res)=>{
		user_data.data = req.body;
		user_data.kind = "UserSignup/v1";
		user_data.title = "New User Signup";
		user_data.description = "This API is used for signing up a new user for the app";
		user_data.legalName = "UserLogin_NewUserSignup";
		user_data.url = "http://localhost:3000/api/v1/usersignup";
		User.findOne({'data.user_email':req.body.user_email}).then(user=>{
			if(user){
				res.status(400).send({'message':'User Already exists'})
			}
			else{
				const newUser = user_data;
				bcrypt.genSalt(10, (err, salt) => {
        		bcrypt.hash(newUser.data.user_password, salt, (err, hash) => {
          			if (err) throw err;
          			newUser.data.user_password = hash;
          			User(newUser).save()
            		.then(user => res.json(user))
            		.catch(err => console.log(err));
        		});
      			});
			}
		})
	})

	app.get("/api/v1/userlist",(req,res)=>{
		User.find({}).then(users=>{
			res.status(200).send(users);
		})
		.catch(err=>{
			res.status(400).send({'message':'Unable to Find Admin Member'});
		})
	})

	app.post("/api/v1/userlogin", (req,res)=>{
		
		User.findOne({'data.user_email':req.body.user_email}).then(user=>{
			if(!user){
				res.status(400).send({'message':'E-Mail of the Member Not Found'});
			}
			else{
				var userData = user;
				userData.kind = "UserLogin/v1";
				userData.title = "User Login";
				userData.description = "This API is used for the user to login for the app";
				userData.legalName = "UserLogin_UserSignup";
				userData.url = "http://localhost:3000/api/v1/userlogin";
				
				bcrypt.compare(req.body.user_password, user.data.user_password).then(isMatch => {
      				if (isMatch) {
        				jwt.sign({user_email:req.body.user_email},'user_key',{expiresIn: 60*60*24},(err, token) => {
            				res.status(200).send({
              					'success': true,
              					'user_data':userData,
              					'token': token
            				});
          				});
      				} 
      				else {
        				res.status(400).send({ 'message': "Entered Password is Incorrect" });
      				}
    			});
			}
		})
	})
};