import { signIn } from "next-auth/react";
import Link from "next/link";

export const FutureHero = () => {
  return (
    <>
      <section id="component-driven" className="bg-gray-200 py-6 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <desc className="mt-8 font-semibold text-sky-500">
            Healing-Driven
          </desc>
          <h1 className="max-w-3xl space-y-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            The Future of Therapy Is Here
          </h1>
          <div className="mt-4 max-w-3xl space-y-6 ">
            Embrace the future of therapy with our comprehensive virtual
            platform. Experience a seamless blend of AI-powered therapy, guided
            meditations, insightful journaling, and productive task management,
            all tailored to support your wellbeing. Discover the future of
            mental health support today.
          </div>
          <div className="w-[200px]">
            <Link
              onClick={() => {
                signIn().catch(console.error);
              }}
              href="/login"
              className="dark:highlight-white/20 mt-4 flex h-12 w-fit items-center justify-center rounded-lg bg-slate-900 px-6 font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-sky-500 dark:hover:bg-sky-400 sm:w-auto"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}