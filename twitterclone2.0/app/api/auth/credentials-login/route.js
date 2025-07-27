

import { NextResponse } from "next/server";
import dbConnect from "../../lib/dBconnect";
import UserProfile from "../../lib/models/UserProfile";

export async function POST(req) {
    try {
        await dbConnect();
        const { username, password } = await req.json();

        // Find user by username
        const user = await UserProfile.findOne({ username });


        // If user does not exist, redirect to userdetailsvialogin
        if (!user) {
            // For a new user, we might want to create a temporary entry or just redirect
            // For this scenario, we'll assume the user will be created/verified on the userdetailsvialogin page.
            // We return a specific status or message to indicate redirection.
            return NextResponse.json(
                { message: "New user, redirect to profile completion", redirectTo: "/userdetailsvialogin" },
                { status: 200 } // Use 200 to indicate success in processing the request, but with a redirect instruction
            );
        }

        // Plain text password comparison
        if (password !== user.password) {
            return NextResponse.json(
                { message: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Check if the user's profile is verified/completed
        // Assuming 'checkpoint' field indicates profile completion status
        const isProfileVerified = user.checkpoint === 'verified';

        // Prepare user data to send back (without password)
        const userWithoutPassword = {
            email: user.email,
            name: user.userrealname,
            username: user.username,
            image: user.profile?.avatar,
            verified: isProfileVerified
        };

        // Determine redirection based on profile verification status
        if (!isProfileVerified) {
            return NextResponse.json(
                { message: "Profile not completed, redirecting", redirectTo: "/userdetailsvialogin", user: userWithoutPassword },
                { status: 200 }
            );
        } else {
            // Profile is verified, redirect to sidebar (or main application page)
            return NextResponse.json(
                { message: "Login successful, redirect to sidebar", redirectTo: "/sidebar", user: userWithoutPassword },
                { status: 200 }
            );
        }

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
