//antes é bom instalar o nextauth => yarn add next-auth
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
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

  //functions que devem ser execultadas apos, login ou logout
  callbacks: {

    //esse callback, vai me permitir inserir informações adicionais a sessão do usuario 
    //logado
    async session(session) {
      try {

        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {

        return {
          ...session,
          activeSubscription: null
        }

      }


    },

    //após login faça isso
    async signIn(user, account, profile) {
      try {
        //saiba mais

        //https://docs.fauna.com/fauna/current/api/fql/cheat_sheet
        const { email } = user;
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(user.email))
              )
            ),
            q.Create(
              q.Collection("users"),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index("user_by_email"),
                q.Casefold(
                  user.email
                )
              )
            )
          )
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});

//https://next-auth.js.org/getting-started/example
