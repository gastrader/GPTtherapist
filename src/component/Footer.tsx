/* eslint-disable react/jsx-no-undef */
import Link from "next/link";
import Image from "next/image"

export function Footer() {

    return (
        <div className="w-full items-center justify-center text-bold flex flex-col">
            <Link href="/" className="flex gap-2 flex-center">
                <Image src="/assets/images/logo.svg" alt="logo" width="40" height="40" className="object-contain" />
                
            </Link>
            <strong className="items-center justify-center text-bold">
                Have an amazing day!
            </strong>
            <div className="gap-2 flex flex-wrap py-2">
                <a href="/about" className=" footer_btn">About Us</a>
                <a href="/contact" className=" footer_btn">Contact Us</a>
                <a href="/team" className=" footer_btn">Team</a>
                <a href="/privacy" className=" footer_btn">Privacy</a>
                <a href="/policy" className=" footer_btn">Policies</a>
            </div>
            <p className="flex gap-1 pb-4">Need Help? Email 
                <a href="mailto:support@gpttherapy.com" className="underline"> support@gpttherapy.com</a>
            </p>
            </div>

    )
}
