//antes é bom instalar o nextauth => yarn add next-auth
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      //esse escopo é responsavel por dizer qual a permissão que minha aplicação
      //vai ter neste usuario
      //https://docs.github.com/pt/enterprise-server@2.22/developers/apps/building-oauth-apps/scopes-for-oauth-apps
      scope: "read:user,public_repo,repo:status",
    }),
    // ...add more providers here
  ],
});

//https://next-auth.js.org/getting-started/example
