import Image from "next/image"
import { listItems } from "~/constants"

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const WhyHero = () => {
    return (
        <section className="py-6 bg-gray-300 lg:py-16 items-center justify-center px-20 mx-20 rounded-3xl mb-5">
            <div className="container text-center lg:text-left">
                <div className="grid lg:grid-cols-2 mb-12 lg:mb-16">
                    <div className="col-span-1">
                        <h2 className=" pb-5 head_text">
                            Why GPTtherapy?
                        </h2>
                        <p className="text-neutral-grayish-blue text-sm lg:text-base leading-5">
                            Say goodbye to traditional barriers and hello to <span className="font-bold">round-the-clock</span> availability! Experience therapy like never before with our hassle-free solution, empowering you to prioritize your mental health with ease.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-9 lg:gap-6 lg:grid-cols-4">
                    {listItems.map((item) => (
                        <div key={item.title} className="justify-center grid-rows-3">
                            <div className="flex justify-center lg:justify-start ">
                                <Image src={item.iconPath} alt="image" width={60} height={60} className="rounded-xl "/>
                            </div>

                            <h2 className="text-lg text-primary-dark-blue py-4 lg:pt-9 lg:pb-6 lg:text-xl lg:font-bold">
                                {item.title}
                            </h2>
                            <p className="text-neutral-grayish-blue text-sm font-light lg:text-base leading-5">
                                {item.subtitle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}