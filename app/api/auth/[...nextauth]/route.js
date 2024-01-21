import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';

import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          const user = await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });


          const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, {
            expiresIn: 30 * 24 * 60 * 60 * 1000,
          })


          const jsnToken = {
            token: token,
            success: true,
            message: "Successfully Registered to Database"
          }
          
          return new Response(JSON.stringify(jsnToken), { status: 201 });
        } else {

          const token = jwt.sign({ email: userExists.email, id: userExists._id }, process.env.JWT_KEY, {
            expiresIn: 30 * 24 * 60 * 60 * 1000,
          })


          const jsnToken = {
            token: token,
            success: true,
            message: "Successfully Registered to Database"
          }
          return new Response(JSON.stringify(jsnToken), { status: 201 });
        }


      } catch (error) {
        console.log(error);
        const msg = {
          success: false,
          message: "Internal Server Error"
        }
        return new Response(JSON.stringify(msg), { status: 500 })
      }
    },
  }
})

export { handler as GET, handler as POST }