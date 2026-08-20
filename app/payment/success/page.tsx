"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";





export default function PaymentSuccessPage() {


  return (


    <main className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-2xl font-bold">Payment Successful</h1>
      <p className="mt-2 text-muted-foreground">
        Your payment has been received. Your rental request is now active —
        check your dashboard for the latest status.
      </p>
      <Link
        href="/dashboard/tenant"
        className={cn(buttonVariants(), "mt-6")}
      >
        Go to Dashboard
      </Link>
    </main>


  );


  
}