import User from "@models/user";
import { connectToDB } from "@utils/database"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



export const POST = async (request) => {
	try {
    await connectToDB();
	const {email,password}=await request.json();
	console.log(email,password);
	const user=await User.findOne({email:email});
	console.log(user);
	if(!user || user.provider==='google'){
		const msg={
			success:false,
			message:"User Not exit or SignIn with google"
		 }
		return new Response(JSON.stringify(msg));
	}
	const passwordCheck=await bcrypt.compare(password,user.password);
	if(!passwordCheck){
		const msg={
			success:false,
			message:"Invalid Credensial !"
		 }
		return new Response(JSON.stringify(msg));
	}
	const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, {
		expiresIn: 30 * 24 * 60 * 60 * 1000,
	})
	const jsnToken = {
		token: token,
		success: true,
		message: "Successfully Registered to Database"
	}
	return new Response(JSON.stringify(jsnToken), { status: 201 });
	} catch (error) {
		console.log(error);
		const msg = {
			success: false,
			message: "Internal Server Error"
		}
		return new Response(JSON.stringify(msg), { status: 500 })
	}
}