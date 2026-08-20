"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";







export default function PaymentCancelPage() {


  return (

    <main className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <XCircle className="h-16 w-16 text-destructive" />
      <h1 className="mt-4 text-2xl font-bold">Payment Cancelled</h1>
      <p className="mt-2 text-muted-foreground">
        Your payment was not completed. No charge was made. You can try again
        anytime from your dashboard.
      </p>
      <Link
        href="/dashboard/tenant"
        className={cn(buttonVariants(), "mt-6")}
      >
        Back to Dashboard
      </Link>
    </main>


  );



  
}