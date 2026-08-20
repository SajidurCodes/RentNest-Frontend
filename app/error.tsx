"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";



export default function GlobalError({error,reset,}: {error: Error & { digest?: string };reset: () => void;
}) {
  useEffect(() => {
    
    console.error(error);



  }, [error]);



  return (


    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">


      <AlertTriangle className="h-12 w-12 text-destructive" />

      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>

      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. You can try again, or head back to the
        homepage.
      </p>



      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Try Again
        </button>
        <Link href="/" className={cn(buttonVariants())}>
          Go Home
        </Link>
      </div>



      
    </main>
  );
}