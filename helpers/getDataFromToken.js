import jwt from "jsonwebtoken"

export const getDataFromToken = (request) => {
	const secret = process.env.JWT_KEY;

	try {
		const header = new Headers(request.headers);
		const authorizationHeaderValue = header.get('authorization');
		const token = authorizationHeaderValue.split(' ')[1];
		if (token) {
			const decodedToken = jwt.verify(token, secret);
			return decodedToken.id;
		} else {
			console.log("token not found");
		}
	} catch (error) {
		throw new Error(error);
	}
}