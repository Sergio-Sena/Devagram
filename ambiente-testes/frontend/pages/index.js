import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Devagram - Ambiente de Testes</title>
        <meta name="description" content="Ambiente de testes para o Devagram" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Bem-vindo ao ambiente de testes do Devagram</h1>
        <p>Este é um ambiente para testar componentes e funcionalidades do frontend.</p>
      </main>
    </>
  );
}