"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <h1 className="text-2xl text-center font-bold my-4">
        Oops, there is nothing to see here.
      </h1>
      <button
        onClick={() => router.push("/")}
        className="w-fit rounded-xl font-bold px-6 py-2 uppercase cursor-pointer text-black hover:bg-white/30 bg-white"
      >
        back
      </button>
    </div>
  );
}
