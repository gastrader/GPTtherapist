/* eslint-disable @next/next/no-img-element */

import { type NextPage } from "next";
import Head from "next/head";
import Greeting from "~/component/Greeting";
import { dashboard } from "../constants";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { el } from "date-fns/locale";



interface DashboardCardProps {
    index: number;
    name: string;
    description: string;
    source_code_link: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    index,
    name,
    description,
    source_code_link,
}) => {
    return (
        <div className='bg-gray-200 p-5 rounded-2xl lg:w-[360px] bg-gradient-to-r from-gray-300 to-gray-200 relative snap-start border border-black'>
            <div className='relative w-full h-[230px]'>

                <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
                    <div
                        onClick={() => window.open(source_code_link, "_blank")}
                        className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                    >
                    </div>
                </div>
            </div>
            <div className='mt-5'>
                <h3 className='text-black font-bold text-[24px]'>{name}</h3>
                <p className='mt-2 text-secondary text-[14px] pb-4'>{description}</p>
            </div>
        </div>
        
    )
}

const Dashboard: NextPage = () => {



    return (
        <div>
            <Head>
                <title>GPTtherapy</title>
                <meta name="description" content="Therapy on the go" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col w-full gap- ">
                <div className="flex items-center justify-center flex-col  border-black border mx-2 rounded-2xl">
                    <h1 className="head_text text-center ">
                        <Greeting/>
                        <br className="max-md:hidden " />
                        <span className="blue_gradient text-center text-4xl "> LET&apos;S GET STARTED </span>
                    </h1>
                    <p className="desc text-center">
                        Select a program below:
                    </p>
                    <div className="flex flex-row gap-2 my-2">
                    {/* voice, generate, chat */}
                    <Link  href="/conversations/new"className="outline_btn">New Chat</Link>
                    <Link href="/existing" className="outline_btn">Existing Chats</Link>
                    </div>
                </div>
                <div className='flex flex-wrap gap-7 py-4 items-center justify-center mx-1'>
                    {dashboard.map((project, index) => (
                        <DashboardCard key={`project-${index}`} index={index} {...project} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
