import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { FutureHero } from "~/component/FutureHero";
import { WhyHero } from "~/component/WhyHero";



const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>GPTtherapy</title>
        <meta name="description" content="Therapy on the go" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="main">
        <div className="gradient" />
      </div>
      <main>
        <div className="mt-10 flex h-full w-full flex-col items-center justify-center ">
          <h1 className="head_text text-center">
            Your Digital Therapy Companion
          </h1>
          <h2 className="blue_gradient head_text text-center ">
            {" "}
            Journey to Wellness Starts Here
          </h2>
          <p className="desc text-center">
            Unleash the power of AI with Thera, your personal digital therapist,
            providing on-demand, tailored mental health support right at your
            fingertips
          </p>
          <Link
            onClick={() => {
              signIn().catch(console.error);
            }}
            href="/login"
            className="dark:highlight-white/20 mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-slate-900 px-6 font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-sky-500 dark:hover:bg-sky-400 sm:w-auto"
          >
            Get Started
          </Link>
          <video
            autoPlay
            controls
            
            className=" bottom-0 my-10 max-w-lg items-end rounded-xl"
          >
            <source src="./assets/images/introvid.mp4" />
          </video>
        </div>

        <FutureHero />

        <WhyHero />
      </main>
    </>
  );}
    
export default Home;
