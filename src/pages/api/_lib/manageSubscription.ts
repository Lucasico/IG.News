import { query as q } from "faunadb"
import { fauna } from "../../../services/fauna"
import { stripe } from "../../../services/stripe"

export async function saveSubscription(subscriptionId: string, customerId: string, createAction = false) {
  //pegando a referencia do usuario no fauna, pra fazer a relação
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  if (createAction) {

    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )

  } else {

    //replace reescreve tudo
    //update atualiza apenas alguns campos
    await fauna.query(
      q.Replace(
        //buscando a ref pra fazer a substituição
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'), subscriptionId
            )
          )
        ),
        { data: subscriptionData }
      )
    )

  }


}
