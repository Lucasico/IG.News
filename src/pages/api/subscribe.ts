import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}
//tem que ser obrigatoriamente com estes nomes =>req e res
export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {
    const session = await getSession({ req });

    /**
     * Verifica se o cliente já existe no fauna retornando ele
     * 
     */
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )


    let customerId = user?.data?.stripe_customer_id

    if (!customerId) {
      //criando o custorme no stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        //metadata:
      })
      /**
       * Pegando aquele usuario que já existe e adicionando o customer_id a ele
       */
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      )

      customerId = stripeCustomer.id
    }


    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      //teste
      customer: customerId,
      //metodo de pagamento
      payment_method_types: ['card'],
      //endereço obrigatorio ou tratar no stripe
      billing_address_collection: 'required',
      //item a serem comprados
      line_items: [
        { price: "price_1IzPz7DsHpsyXr4ZkaezH32d", quantity: 1 }
      ],
      //modo de pagamento, como é assitura é subscription, mas
      //poderia ser outros, como por exemplo payment
      mode: "subscription",
      //possivel aplicar cupons de desconto
      allow_promotion_codes: true,
      //pagina de sucesso apos a compra
      success_url: process.env.STRIPE_SUCCESS_URL,
      //pagina de erro após a tentativa de compra
      cancel_url: process.env.STRIPE_CANCEL_URL

    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('allow', 'POST');
    res.status(405).end('Method not allowed')
  }
}