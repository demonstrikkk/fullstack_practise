import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dBconnect';
import UserProfile from '../../lib/models/UserProfile';
import { v4 as uuidv4 } from 'uuid';
// import { useSession } from 'next-auth/react';
export async function POST(req) {
  // const { data: session, status } = useSession();
  try {
    const body = await req.json();
    const {
      email,
      name,
      image,
      username,
      password,
      bio,
     
    } = body;

    await dbConnect();

    let user = await UserProfile.findOne({ email });

    if (user) {
      // Update existing user
      user.username = username;
      user.password = password; // Hash in production!
      user.userrealname = name;
      user.checkpoint = 'verified';
      user.profile.bio = bio;
      user.profile.avatar = image;
      user.profile.displayName = name;
      
      

      await user.save();
    } else {
      // Create new user
      const newUser = new UserProfile({
        email,
        userId: uuidv4(),
        userrealname: name,
        username,
        password,
        checkpoint: 'verified',
        profile: {
          displayName: name,
          avatar: image,
          bio,
        
         
        },
      });

      await newUser.save();
    }

    return NextResponse.json({ message: 'User saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/users/create-user:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
