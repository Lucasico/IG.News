import Head from "next/head";

export default function Home() {
  return (
    <>
      {/**
       * esse componente pode ser chamado onde for necessario
       * ai ele vai adicionar o que estiver dentro deste Head
       * ao head do _document.tsx
       */}
      <Head>
        <title>Início | ig.news</title>
      </Head>
      <h1>Hello word ff</h1>
    </>
  );
}
