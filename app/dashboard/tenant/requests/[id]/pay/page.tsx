"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { paymentService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";



export default function PayPage({params}: {params: Promise<{ id: string }>;}) {


  const { id } = use(params);

  const [error, setError] = useState<string | null>(null);

  const hasInitiated = useRef(false);


  useEffect(() => {

    async function initiatePayment() {

      if (hasInitiated.current) return;

      hasInitiated.current = true;


      try {

        const res = await paymentService.create(id);


const { paymentUrl } = res.data.data;
        if (!paymentUrl) {

          setError(
            "Payment could not be started for this request. It may already have a payment in progress — check with support or try a different request."
          );

          return;


        }


        
        window.location.href = paymentUrl;



      } catch (err) {


        setError(getErrorMessage(err, "Could not start the payment process"));


      }

    }

    initiatePayment();

  }, [id]);


  return (


    <main className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">


      {error ? (
        <>
          <h1 className="text-xl font-semibold text-destructive">
            Payment failed to start
          </h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Link
            href="/dashboard/tenant"
            className={cn(buttonVariants(), "mt-6")}
          >
            Back to Dashboard
          </Link>
        </>
      ) : (

        <>
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            Redirecting you to secure checkout...
          </p>
        </>


      )}



    </main>




  );
}