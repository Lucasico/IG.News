import Stripe from "stripe";
// import { version } from "../../package.json";

/**
 * A stripe é uma sdk, que ja vai retorna todos os metodos
 * necessarios para usar o serviço, sendo necessario instalar
 * o pacote e fazer a seguinte config
 */
export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    name: "Ignews",
    version: "1.0.1",
  },
});
