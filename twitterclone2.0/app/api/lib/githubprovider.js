const GitHubProviderCustom = ({ clientId, clientSecret }) => ({
  id: "github",
  name: "GitHub",
  type: "oauth",
  authorization: {
    url: "https://github.com/login/oauth/authorize",
    params: { scope: "read:user user:email" },
  },
  token: "https://github.com/login/oauth/access_token",
  userinfo: {
    url: "https://api.github.com/user",
    async request({ tokens }) {
      const res = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      const profile = await res.json();

      if (!profile.email) {
        const emailRes = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `token ${tokens.access_token}`,
          },
        });
        const emails = await emailRes.json();
        profile.email = emails.find((e) => e.primary)?.email || emails[0]?.email;
      }

      return profile;
    },
  },
  profile(profile) {
    return {
      id: profile.id.toString(),
      name: profile.name ?? profile.login,
      email: profile.email,
      image: profile.avatar_url,
    };
  }
});

export default GitHubProviderCustom;

