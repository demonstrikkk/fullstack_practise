export const dynamic = 'force-dynamic';

const CustomCredentialsProvider = (options) => ({
  id: "credentials",
  name: options.name || "Credentials",
  type: "credentials",
  credentials: options.credentials || {
    username: { label: "Username", type: "text", placeholder: "your_username" },
    password: { label: "Password", type: "password" },
  },
  authorize: options.authorize,
});

export default CustomCredentialsProvider;
