/* eslint-disable @next/next/no-img-element */

import { type NextPage } from "next";
import Head from "next/head";
import Greeting from "~/component/Greeting";
import { dashboard } from "../constants";
import Link from "next/link";
import Image from "next/image";


interface DashboardCardProps {
  index: number;
  name: string;
  description: string;
  source_code_link: string;
  picture: string;
  Icon: React.ComponentType<{ className?: string }>;
  construction: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  
  name,
  description,
  source_code_link,
  picture,
  Icon,
  construction,
}) => {
  return (
    <Link href={source_code_link}>
      <div className="relative snap-start rounded-2xl border border-black bg-gray-200 bg-gradient-to-r from-gray-300 to-gray-200 p-5 lg:w-[360px]">
        {construction && ( // Step 3: Conditionally render the "construction.png" image
          <img
            src="./assets/images/construction.png"
            alt="Under Construction"
            className="absolute inset-0 h-full w-full rounded-2xl object-cover z-10"
          />
        )}
        <div className="relative h-[230px] w-full">
          <div className="card-img_hover absolute inset-0 flex justify-end">
            <Image
              alt="card"
              src={picture}
              width={200}
              height={100}
              className="mx-auto"
            ></Image>
            <div className="black-gradient flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-300">
              <Icon className=" h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-[24px] font-bold text-black">{name}</h3>
          <p className="mt-2 pb-4 text-[14px] text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
};

const Dashboard: NextPage = () => {
  return (
    <div>
      <Head>
        <title>GPTtherapy</title>
        <meta name="description" content="Therapy on the go" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="gap- flex w-full flex-col ">
        <div className="mx-2 flex flex-col items-center  justify-center rounded-2xl">
          <div className="head_text text-center ">
            <Greeting />
            <br className="max-md:hidden " />
            <span className="blue_gradient text-center text-4xl ">
              {" "}
              LET&apos;S GET STARTED{" "}
            </span>
          </div>
          <p className="desc text-center">Select a resource below:</p>
        </div>
        <div className="mx-1 flex flex-wrap items-center justify-center gap-7 py-4">
          {dashboard.map((project, index) => (
            <DashboardCard
              key={`project-${index}`}
              index={index}
              {...project}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
