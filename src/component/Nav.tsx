import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../component/ui/dropdown-menu";
import { BellRing, Cloud, LayoutGrid, LifeBuoy, LogOut, Settings, User } from "lucide-react";
export function Nav() {
  const session = useSession();
  const isLoggedIn = !!session.data;

  // console.log(isLoggedIn);

  const { data: credits } = api.user.getCredits.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  return (
    <>
      <div>
        <a
          id="scroll-stopper"
          className="text-s flex h-6 w-full items-end justify-end bg-gradient-to-r from-cyan-500 to-indigo-500 pr-2 text-white hover:cursor-pointer"
          onClick={() => {
            signIn().catch(console.error);
          }}
        >
          Try it for FREE →
        </a>
      </div>
      <div className="container mx-auto flex h-16 items-center justify-between rounded-lg bg-gray-200 px-4 py-3 text-gray-500">
        <Link href="/" className="flex-center flex gap-2">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width="40"
            height="40"
            className="object-contain"
          />
          <p className="text-lg font-semibold tracking-wide text-black">
            GPTtherapy
          </p>
        </Link>
        <ul className="flex gap-2">
          {isLoggedIn && (
            <>
              <Link href="/dashboard" className="blue_btn">
                Let&apos;s Get Started!
              </Link>
            </>
          )}
        </ul>
        <ul>
          {isLoggedIn && (
            <li className="flex items-center gap-4">
              <p>Credits Remaining: {credits}</p>
              
              {session.data?.user?.image && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Image
                      src={session.data.user.image}
                      alt="profile pic"
                      width="37"
                      height="37"
                      className="rounded-full"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem>
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Transcripts</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BellRing className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Cloud className="mr-2 h-4 w-4" />
                      <span>Premium</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem
                      onClick={() => {
                        signOut({
                          callbackUrl: "http://localhost:3000/",
                        }).catch(console.error);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <button
                className="outline_btn"
                onClick={() => {
                  signIn().catch(console.error);
                }}
              >
                LOGIN
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
