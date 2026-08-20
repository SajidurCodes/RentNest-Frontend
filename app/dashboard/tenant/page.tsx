"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {Tabs,TabsContent,TabsList,TabsTrigger} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import {RentalStatusBadge,PaymentStatusBadge} from "@/components/shared/status-badge";
import { LeaveReviewDialog } from "@/components/dashboard/leave-review-dialog";
import { rentalService, paymentService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { RentalRequest, Payment } from "@/types";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";







export default function TenantDashboardPage() {


  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "payments" ? "payments" : "requests";

  const [payments, setPayments] = useState<Payment[]>([]);

  const [isLoading, setIsLoading] = useState(true);


  const loadData = useCallback(async () => {


    setIsLoading(true);


    try {

      const [rentalsRes, paymentsRes] = await Promise.all([
        rentalService.getMine(),
        paymentService.getMine(),

      ]);

      setRentals(rentalsRes.data.data);

      setPayments(paymentsRes.data.data);

    } catch (error) {

      toast.error(getErrorMessage(error, "Could not load your dashboard"));

    } finally {

      setIsLoading(false);


    }

  }, []);



  useEffect(() => {


    const timeoutId = window.setTimeout(() => {

      void loadData();

    }, 0);


    return () => window.clearTimeout(timeoutId);


  }, [loadData]);



  return (



    <main className="mx-auto max-w-5xl px-4 py-8">


      <h1 className="mb-6 text-2xl font-semibold">My Dashboard</h1>

      <Tabs defaultValue={initialTab}>
        <TabsList>
          <TabsTrigger value="requests">Rental Requests</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>


        
        <TabsContent value="requests" className="space-y-4 pt-4">
          {isLoading ? (
            <SkeletonList />
          ) : rentals.length === 0 ? (
            <EmptyState message="You haven't requested any properties yet.">
              <Link
                href="/properties"
                className={cn(buttonVariants(), "mt-3")}
              >
                Browse Properties
              </Link>
            </EmptyState>
          ) : (
            rentals.map((rental) => (
              <div
                key={rental.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{rental.property.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Move-in {new Date(rental.moveInDate).toLocaleDateString()} ·{" "}
                    {rental.leaseDuration} months
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <RentalStatusBadge status={rental.status} />

                  {rental.status === "APPROVED" && (
                    <Link
                      href={`/dashboard/tenant/requests/${rental.id}/pay`}
                      className={cn(buttonVariants({ size: "sm" }))}
                    >
                      Pay Now
                    </Link>
                  )}

                  {(rental.status === "ACTIVE" ||
                    rental.status === "COMPLETED") && (
                    <LeaveReviewDialog
                      propertyId={rental.property.id}
                      onSubmitted={loadData}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>




        
        <TabsContent value="payments" className="space-y-4 pt-4">

          {isLoading ? (
            <SkeletonList />
          ) : payments.length === 0 ? (
            <EmptyState message="No payments yet." />

          ) : (
            <div className="overflow-hidden rounded-lg border">


              <table className="w-full text-sm">


                <thead className="bg-muted/50 text-left">

                  <tr>
                    <th className="p-3 font-medium">Amount</th>
                    <th className="p-3 font-medium">Provider</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Paid At</th>
                  </tr>


                </thead>


                <tbody>


                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-t">
                      <td className="p-3">৳{payment.amount.toLocaleString()}</td>
                      <td className="p-3">{payment.provider}</td>
                      <td className="p-3">
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString()
                          : "—"}
                      </td>

                    </tr>

                    

                  ))}

                  
                </tbody>

              </table>


            </div>


          )}


        </TabsContent>


      </Tabs>


    </main>





  );
}

function SkeletonList() {


  return (

    <div className="space-y-3">

      {Array.from({ length: 3 }).map((_, i) => (

        <Skeleton key={i} className="h-20 w-full rounded-lg" />

      ))}

    </div>


  );


}



function EmptyState({ message,children}: { message: string; children?: React.ReactNode;}) {




  return (


    <div className="rounded-lg border border-dashed p-10 text-center">
      <p className="text-muted-foreground">{message}</p>
      {children}
    </div>


  );



}