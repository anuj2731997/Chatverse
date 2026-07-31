import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/chat");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight">
          ChatVerse
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          A modern realtime messaging platform built with
          Next.js, Convex, Clerk and TypeScript.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/sign-up"
            className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800"
          >
            Get Started
          </Link>

          <Link
            href="/sign-in"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 transition hover:bg-gray-100"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}



// 'use client'

// import { Authenticated, Unauthenticated } from 'convex/react'
// import { SignInButton, UserButton } from '@clerk/nextjs'
// import { useQuery } from 'convex/react'
// import { api } from '../convex/_generated/api'

// export default function Home() {
//   return (
//     <>
//       <Authenticated>
//         <UserButton />
//         <Content />
//       </Authenticated>
//       <Unauthenticated>
//         <SignInButton />
//       </Unauthenticated>
//     </>
//   )
// }

// function Content() {
//   const user = useQuery(api.users.current);
//   return <div>Authenticated content: {JSON.stringify(user, null, 2)}</div>
// }