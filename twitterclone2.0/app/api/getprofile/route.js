<<<<<<< HEAD
// app/api/generate-static-code/route.js
export async function GET() {
  const htmlCode = `
    <!DOCTYPE html>
    <html>
    <head><title>Generated Page</title></head>
    <body><h1>Hello from Generated Code!</h1></body>
    </html>
  `;

  return new Response(JSON.stringify({ code: htmlCode }), {
    headers: { 'Content-Type': 'application/json' },
=======
// import { NextResponse } from "next/server";
// import dbConnect from "../lib/dBconnect";
// import UserProfile from "../lib/models/UserProfile";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../lib/authOptions"; // path to your auth config

// export async function GET(req) {
//   await dbConnect();

//   const session = await getServerSession(authOptions);

//   if (!session || !session.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const email = session.user.email;

//   try {
//     const user = await UserProfile.findOne({ email }).lean();

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const profile = {
//       displayName: user.profile?.displayName || "",
//       avatar: user.profile?.avatar || "",
//       bio: user.profile?.bio || "",
//       location: user.profile?.location || "",
//     };

//     return NextResponse.json({ profile });
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


export async function GET(request) {
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731
  });
}
