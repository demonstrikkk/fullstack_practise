import { OAuthConfig } from "next-auth/providers/oauth";

const GoogleProviderCustom = (options) => ({
  id: "google",
  name: "Google",
  type: "oauth",
  authorization: {
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    params: {
      scope: "openid email profile",
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
    },
  },
  token: "https://oauth2.googleapis.com/token",
  userinfo: {
    url: "https://www.googleapis.com/oauth2/v3/userinfo",
    async request({ tokens }) {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      const profile = await res.json();
      return profile;
    },
  },
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    };
  },

});

export default GoogleProviderCustom;
