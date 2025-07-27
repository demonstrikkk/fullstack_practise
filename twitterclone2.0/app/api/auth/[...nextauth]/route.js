

// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../lib/dBconnect";
import UserProfile from "../../lib/models/UserProfile";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        const user = await UserProfile.findOne({ 
          username: credentials.username,
          password: credentials.password // Plain text comparison
        });

        if (!user) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.userrealname,
          image: user.profile?.avatar,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();
      
      if (account.provider === 'credentials') {
        return true; // Already verified in authorize callback
      }

      // For OAuth providers
      const existingUser = await UserProfile.findOne({ email: user.email });
      if (existingUser?.checkpoint === 'verified') {
        return true;
      }
      return '/userdetailvialogin'; // Redirect to complete profile
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.username = token.username;
      session.user.realname = token.userrealname;
      session.user.avatar = token.avatar;
      session.user.bio = token.bio;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
