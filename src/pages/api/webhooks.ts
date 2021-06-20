import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

//*funçao de conversão
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);

}

//https://nextjs.org/docs/api-routes/api-middlewares
//Enables body parsing, you can disable it if you want to consume it as a stream
export const config = {
  api: {
    bodyParser: false
  }
}

//uma especie de array, mas que não permite elementos duplicados
const relevantEvents = new Set([
  'checkout.session.completed'
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const secret = req.headers['stripe-signature']
    // console.log('buf ====>', buf)
    let event: Stripe.Event;

    try {

      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)

    } catch (err) {
      console.log('error ==>', err.message)
      return res.status(400).send(`Webhook error: ${err.message}`);

    }
    // console.log('event', event)
    const type = event?.type;

    if (relevantEvents.has(type)) {
      console.log('evento recebido', event)
    }

    res.status(200).json({ received: true })

  } else {
    res.setHeader('allow', 'POST');
    res.status(405).end('Method not allowed')
  }
}

/**
 * Webhook é uma forma de recebimento de informações, que são passadas quando um evento acontece. Em real time
 */

/**
 * Os dados do webhook do stripe chegam em forma de stream, sendo assim não se é necessario entender
 * exatamento o que o codigo de conversão faz
 */