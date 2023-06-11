import { type NextPage } from "next";
import Head from "next/head";
//profile added from branch

const Home: NextPage = () => {

    return (
        <section className="main">
            <Head>
                <title>GPTtherapy</title>
                <meta name="description" content="Therapy on the go" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="w-full h-full flex items-center justify-center flex-col mb-[500px]">
                <h1 className="head_text text-center">PROFILE
                    <br className="max-md:hidden" />
                    <span className="blue_gradient text-center "> GET STARTED BRO </span>
                </h1>
                <p className="desc text-center">
                    Moodtracker, journal, meditation app..
                </p>
            </div>
        </section>
    )
}

export default Home;
