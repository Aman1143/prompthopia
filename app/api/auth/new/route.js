import { connectToDB } from "@utils/database";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "@models/user";

export const POST = async (req, res) => {
	try {

		await connectToDB();
		let { email, password, username } = await req.json();
		const userExit = await User.findOne({ email: email });

		if (userExit) {
			const message = {
				success: false,
				msg: "user already exit"
			}
			return new Response(JSON.stringify(message));
		}
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			email,
			username,
			image: "No image",
			password: hashPassword,
			provider: "email",
			gooleId: null,
		})
		await user.save();
		const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, {
			expiresIn: 30 * 24 * 60 * 60 * 1000,
		})
		const jsnToken = {
			token: token,
			success: true,
			message: "Successfully Registered to Database"
		}
		return new Response(JSON.stringify(jsnToken), { status: 201 })
	} catch (error) {
		const msg = {
			success: false,
			message: "Internal Server Error"
		}
		return new Response(JSON.stringify(msg), { status: 500 })
	}
}

