import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Nav } from "~/component/Nav";
import { useRouter } from "next/router";
import { Footer } from "~/component/Footer";
import { type NextPage } from "next";
import { type ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const router = useRouter();
  const showNavBar = !router.pathname.includes("/payment");
  const showFooter = !router.pathname.includes("/conversations");

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <div className="relative flex min-h-screen flex-col">
        {showNavBar && <Nav />}
        {getLayout(<Component {...pageProps} />)}
        {showNavBar && showFooter && <Footer />}
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
