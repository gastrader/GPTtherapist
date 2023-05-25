import Link from "next/link";
import Image
from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
export function Nav() {

    const session = useSession();
    const isLoggedIn = !!session.data;

    const credits = api.user.getCredits.useQuery();
    
    return <header className="px-4 container mx-auto text-gray-500 flex justify-between h-16 items-center pt-3" >
        <Link href="/" className="flex gap-2 flex-center">
            <Image src="/assets/images/logo.svg" alt="logo" width="40" height="40" className="object-contain"/>
            <p className="font-semibold text-lg text-black tracking-wide">GPTtherapy</p>
        </Link>
        <ul>
            {isLoggedIn && (
            <Link href="/generate" className="black_btn">Talk to a therapist</Link>)}
        </ul>
        <ul>
            {isLoggedIn && (
                <li className="flex gap-2 items-center">
                
                    <p>Credits Remaining: {credits.data}</p>                    
                    <button  className="outline_btn" onClick={() => {
                        signOut({ callbackUrl: 'http://localhost:3000/' }).catch(console.error)
                    }}>
                        LOGOUT
                    </button>
                    {session.data?.user?.image && (
                        <Link href="/profile" >
                            <Image src={session.data.user.image} alt="profile pic" width="37" height="37" className="rounded-full"/>
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
    </header>;
}