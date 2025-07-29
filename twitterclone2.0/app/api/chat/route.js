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
export async function GET(request) {
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731
  });
}
