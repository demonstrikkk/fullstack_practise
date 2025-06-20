


import NextAuth from 'next-auth'; 
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { v4 as uuidv4 } from 'uuid';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign-in, store a persistent userId
      if (user) {
        token.userId = token.userId || uuidv4();
      }
      
      // Attach provider info if available
      if (account) {
        token.provider = account.provider;
      }
      
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.userId; // Store userId in session
      session.user.provider = token.provider; // Store provider info
      return session;
    },
  },
};




// const authOptions = {
//   providers: [
//     Providers.GitHub({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     Providers.Google({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//   ],
//   callbacks: {
//     async jwt(token, account) {
//       if (account) {
//         await dbConnect();
//         const userFromDb = await User.findOne({ email: token.email });
//         if (userFromDb && userFromDb.username && userFromDb.password) {
//           token.needsOnboarding = false;
//         } else {
//           token.needsOnboarding = true;
//         }
//       }
//       return token;
//     },
//     async session(session, token) {
//       session.user.needsOnboarding = token.needsOnboarding;
//       return session;
//     },
//   },
// };

// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import GithubProvider from 'next-auth/providers/github';
// import dbConnect from '../../lib/dBconnect';
// import UserProfile from '../../lib/models/UserProfile';
// import { v4 as uuidv4 } from 'uuid';

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account, profile }) {
//       if (account) {
//         await dbConnect();
//         let userFromDb = await UserProfile.findOne({ email: profile.email });
//         if (!userFromDb) {
//           userFromDb = new User({
//             email: profile.email,
//             userId: uuidv4(),
//           });
//           await userFromDb.save();
//         }
//         token.userId = userFromDb.userId;
//         token.needsOnboarding = !(userFromDb.username && userFromDb.password);
//         token.provider = account.provider;
//         if (account.provider === 'google') {
//           token.providerId = profile.sub;
//         } else if (account.provider === 'github') {
//           token.providerId = profile.id;
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.userId;
//       session.user.provider = token.provider;
//       session.user.providerId = token.providerId;
//       session.user.needsOnboarding = token.needsOnboarding;
//       return session;
//     },
//   },
// };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };