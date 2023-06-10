import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
export function Nav() {

    const session = useSession();
    const isLoggedIn = !!session.data;

    // console.log(isLoggedIn);

    const { data: credits } = api.user.getCredits.useQuery(undefined, { enabled: isLoggedIn });

    return (
        <>
            <div >
                <a id="scroll-stopper" className="w-full h-6 bg-gradient-to-r from-cyan-500 to-indigo-500 text-s justify-end items-end flex pr-2 hover:cursor-pointer text-white" onClick={() => {
                    signIn().catch(console.error)}}>
                    Try it for FREE →
                </a>
                
            </div>
            <div className="px-4 container mx-auto text-gray-500 flex justify-between h-16 items-center py-3 bg-gray-200 rounded-lg" >
                <Link href="/" className="flex gap-2 flex-center">
                    <Image src="/assets/images/logo.svg" alt="logo" width="40" height="40" className="object-contain" />
                    <p className="font-semibold text-lg text-black tracking-wide">GPTtherapy</p>
                </Link>
                <ul className="flex gap-2">
                    {isLoggedIn && (
                        <>
                            <Link href="/dashboard" className="blue_btn">Let&apos;s Get Started!</Link>
                        </>)}
                </ul>
                <ul>
                    {isLoggedIn && (
                        <li className="flex gap-2 items-center">

                            <p>Credits Remaining: {credits}</p>
                            <button className="outline_btn" onClick={() => {
                                signOut({ callbackUrl: 'http://localhost:3000/' }).catch(console.error)
                            }}>
                                LOGOUT
                            </button>
                            {session.data?.user?.image && (
                                <Link href="/profile" >
                                    <Image src={session.data.user.image} alt="profile pic" width="37" height="37" className="rounded-full" />
                                </Link>
                            )}
                        </li>)}
                    {!isLoggedIn && (
                        <li>
                            <button className="outline_btn" onClick={() => {
                                signIn().catch(console.error)
                            }}>
                                LOGIN
                            </button>
                        </li>)}
                </ul>
            </div>
        </>
    )
}
