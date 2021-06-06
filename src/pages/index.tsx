import Head from "next/head";
import { stripe } from "../services/stripe";
import { GetServerSideProps, GetStaticProps } from "next";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "./home.module.scss";

type homeProps = {
  product: {
    priceId: string;
    amount: number;
  };
};

export default function Home({ product }: homeProps) {
  return (
    <>
      {/**
       * esse componente pode ser chamado onde for necessario
       * ai ele vai adicionar o que estiver dentro deste Head
       * ao head do _document.tsx
       */}
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcomewww</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get acess to all the publication <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  //este parametro do retrieve é o APIID do produto
  // const price = await stripe.prices.retrieve("price_1IzPz7DsHpsyXr4ZkaezH32d", {
  //   expand: ["product"],
  // });

  const price = await stripe.prices.retrieve("price_1IzPz7DsHpsyXr4ZkaezH32d");
  console.log("fez a request");
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },

    revalidate: 60 * 60,
  };
};
