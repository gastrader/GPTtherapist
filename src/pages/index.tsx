import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {

  return (

      <section className="main">
      <Head>
        <title>GPTtherapy</title>
        <meta name="description" content="Therapy on the go" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="w-full h-full flex items-center justify-center flex-col mb-[500px]">
          <h1 className="head_text text-center">Your Digital Therapy Companion
            <br className="max-md:hidden" />
            <span className="blue_gradient text-center "> Journey to Wellness Starts Here </span>
          </h1>
          <p className="desc text-center">
            Unleash the power of AI with Thera, your personal digital therapist, providing on-demand, tailored mental health support right at your fingertips
            {/* Unleash emotional freedom today through the power of AI, Thera is your personal digital therapist, providing on-demand, tailored mental health support right at your fingertips */}
          </p>
        </div>
        </section>
        )}
    
export default Home;
