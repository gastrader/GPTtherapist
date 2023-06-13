/* eslint-disable react/jsx-no-undef */
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="text-bold flex w-full flex-col items-center justify-center">
      <Link href="/" className="flex-center flex gap-2">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width="40"
          height="40"
          className="object-contain"
        />
      </Link>
      <strong className="text-bold items-center justify-center">
        Have an amazing day!
      </strong>
      <div className="flex flex-wrap gap-2 py-2">
        <a href="/about" className=" footer_btn">
          About Us
        </a>
        <a href="/contact" className=" footer_btn">
          Contact Us
        </a>
        <a href="/team" className=" footer_btn">
          Team
        </a>
        <a href="/privacy" className=" footer_btn">
          Privacy
        </a>
        <a href="/policy" className=" footer_btn">
          Policies
        </a>
      </div>
      <p className="flex gap-1 pb-4">
        Need Help? Email
        <a href="mailto:support@gpttherapy.com" className="underline">
          {" "}
          support@gpttherapy.com
        </a>
      </p>
    </footer>
  );
}
