

import dbConnect from '../lib/dBconnect';
import UserProfile from '../lib/models/UserProfile';

export async function POST(req) {
  await dbConnect();

  const contentType = req.headers.get("content-type");
  let body;

  try {
    if (contentType && contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = {};
      formData.forEach((value, key) => {
        body[key] = value;
      });
    } else {
      return new Response(JSON.stringify({ error: "Unsupported Content-Type" }), { status: 400 });
    }

    const pathname = req.nextUrl?.pathname;

    if (pathname === '/api/save') {
      const newStudent = new UserProfile(body);
      await newStudent.save();
      return new Response(JSON.stringify({ message: 'Data inserted', student: newStudent }), { status: 201 });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid API Endpoint' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
