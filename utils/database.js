import mongoose from "mongoose";

let isConnected=false;

export const connectToDB=async()=>{
	mongoose.set('strictQuery',true);
	if(isConnected){
		console.log("MongoDB is already connected");
		return;
	}
	try {
		// console.log(process.env.MONGODB_URI)
		// console.log("helo0");
		await mongoose.connect(process.env.MONGODB_URI,{
			dbName:"share_prompt",
			useNewUrlParser:true,
			useUnifiedTopology:true,
		})
		isConnected=true;
		console.log("MongoDb COnnected")
	} catch (error) {
		console.log(error);
	}
}