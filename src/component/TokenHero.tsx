import Image from "next/image"

export const TokenHero = () => {
    return (
        <div className="flex flex-col w-full items-center justify-center bg-gradient-to-t from-cyan-100 to-blue-200 rounded-full mx-auto max-w-[clamp(1px,73.8888888889vw,1064px)] my-10">
            <h1 className="head_text">How does it work?</h1>
            <Image src="/assets/images/hero/token.png" alt="token" width={100} height={100} />
            <div className="w-1/2 text-lg">
                Choose from a variety of subscription plans tailored to your needs, allowing you to customize your therapy and wellness experience based on your preferences and budget. <br/> <br />
                <a className="">Buy tokens and spend them at your own pace</a>
            </div>
            <button className="outline_btn py-4 my-4">
                Start your free trial today!
            </button>
            
            
        </div>
    )
}