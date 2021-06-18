import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {
    const session = await getSession({ req });

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
      //metadata:
    })

    const stripeCheckoutSession = await stripe.checkout.sessions.create({

      customer: stripeCustomer.id,
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