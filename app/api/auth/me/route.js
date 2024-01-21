import { getDataFromToken } from "@helpers/getDataFromToken";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
	try {
		await connectToDB();
		const userId = getDataFromToken(request);
		if (!userId) {
			const msg = {
				message: "token not found",
				success: false,
			}
			return new Response(JSON.stringify(msg))
		}
		const user = await User.findOne({ _id: userId }).select("-password");
		const data = {
			message: "User found",
			user: user,
			success: true,
		}
		return new Response(JSON.stringify(data));
	} catch (error) {
		const msg = {
			message: "Internal Server Error",
			success: false,
		}
		return new Response(JSON.stringify(msg))
	}
}