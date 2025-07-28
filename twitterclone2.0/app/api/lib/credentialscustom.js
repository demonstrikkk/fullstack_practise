const CustomCredentialsProvider = (options) => ({
  id: "credentials",
  name: "Custom Credentials",
  type: "credentials",

  credentials: {
    email: {
      label: "Email",
      type: "text",
      placeholder: "user@example.com",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },

  async authorize(credentials, req) {
    const { email, password } = credentials;

    // Example: Replace this with your own DB logic
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "user@example.com",
      password: "123456", // Normally hashed
    };

    if (
      email === mockUser.email &&
      password === mockUser.password // You should use hashed password comparison!
    ) {
      return {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      };
    }

    // If login fails
    return null;
  },

  ...options,
});

export default CustomCredentialsProvider;
