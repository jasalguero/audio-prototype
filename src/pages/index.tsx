import { type NextPage } from "next";
import Header from "~/components/layout/header";
import Head from "next/head";
import SideBar from "~/components/layout/sidebar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Moby.read Prototype</title>
        <meta
          name="description"
          content="Prototype for new version of Moby.read"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <SideBar />
      </main>
    </>
  );
};

export default Home;
