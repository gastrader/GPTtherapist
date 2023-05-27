import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { AboutUs } from "~/component/AboutUs";

const Home: NextPage = () => {

  return (
  <>
    <Head>
      <title>GPTtherapy</title>
      <meta name="description" content="Therapy on the go" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
      <div className="main">
        <div className="gradient"/>
      </div>
      <main>
      <div className="w-full h-full flex items-center justify-center flex-col mt-40 mb-[500px] ">
        <h1 className="head_text text-center">Your Digital Therapy Companion</h1>
        <h2 className="blue_gradient head_text text-center "> Journey to Wellness Starts Here</h2>
        <p className="desc text-center">
          Unleash the power of AI with Thera, your personal digital therapist, providing on-demand, tailored mental health support right at your fingertips
        </p>
          <Link onClick={() => {signIn().catch(console.error)}} href="/login" className="bg-slate-900 hover:bg-slate-700 focus:outline-none mt-4 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">Get Started</Link>
      </div>
      <AboutUs />
    </main>
  </>
)}
    
export default Home;
