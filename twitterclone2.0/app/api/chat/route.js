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
  });
}
