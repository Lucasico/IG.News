//esse aquivo vai funcionar da mesma forma do index.html, que fica dentro da pasta
//public de uma aplicação react normal

//ele deve ser obrigatoriamente como class

import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {
            //o preconnect deve vir antes
          }
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,700;0,900;1,400&display=swap"
            rel="stylesheet"
          />
          <link
            rel="shortcut icon"
            href="/images/favicon.png"
            type="image/png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
