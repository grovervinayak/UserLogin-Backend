const mongoose=require('mongoose');
const {Schema}=mongoose;
const UserSchema=new Schema({
	kind: String,
	domain: String, 
	url: String,
	title: String,
	description: String,
	legalName: String,
	organization: String,
	project: String,
	license: String,
	author: String,
	data: {
		user_name: String,
		user_email: String,
		user_phone_number: String,
		user_password: String
	}
});
module.exports = mongoose.model('Users',UserSchema);