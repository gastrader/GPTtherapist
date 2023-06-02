import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const SuccessPage = () => {
    const router = useRouter();

    // Redirect to the home page after a delay
    useEffect(() => {
        setTimeout(() => {
            void router.push('/');
        }, 3000); // Adjust the delay as needed
    }, [router]);

    return (
        <section className="main">
            <Head>
                <title>GPTtherapy</title>
                <meta name="description" content="Therapy on the go" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="w-full h-full flex items-center justify-center flex-col mb-[500px]">
                <h1 className="success_text text-center text-green-700">Your payment has been processed!
                    <br className="max-md:hidden" />
                    <span className="text-center text-3xl text-black"> Redirecting to home page... </span>
                </h1>
            </div>
        </section>
    );
};

export default SuccessPage;