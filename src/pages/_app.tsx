import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Nav } from "~/component/Nav";
import { useRouter } from "next/router";
import { Footer } from "~/component/Footer";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },

}) => {

  const router = useRouter();
  const showNavBar = !router.pathname.includes('/payment')

  return (
    <SessionProvider session={session}>
      {showNavBar && <Nav />}
      <Component {...pageProps} />
      {showNavBar && <Footer />}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
