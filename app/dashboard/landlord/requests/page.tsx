"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { rentalService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { RentalRequest } from "@/types";





export default function LandlordRequestsPage() {


  const [requests, setRequests] = useState<RentalRequest[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [processingId, setProcessingId] = useState<string | null>(null);


  useEffect(() => {


    let isCancelled = false;


    const fetchRequests = async () => {

      try {

        const res = await rentalService.getLandlordRequests();

        if (!isCancelled) {

          setRequests(res.data.data);

        }
      } catch (error) {

        if (!isCancelled) {

          toast.error(getErrorMessage(error, "Could not load requests"));

        }

      } finally {


        if (!isCancelled) {

          setIsLoading(false);


        }


      }


    };

    fetchRequests();


    return () => {

      isCancelled = true;

    };

  }, []);



  const handleDecision = async (

    request: RentalRequest,

    decision: "approve" | "reject"

  ) => {

    setProcessingId(request.id);
    const newStatus = decision === "approve" ? "APPROVED" : "REJECTED";

    
    setRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: newStatus } : r))
    );


    try {

      if (decision === "approve") {

        await rentalService.approve(request.id);

      } else {

        await rentalService.reject(request.id);

      }


      toast.success(decision === "approve" ? "Request Approved" : "Request Rejected"
      );


    } catch (error) {



      
      setRequests((prev) =>
        prev.map((r) => r.id === request.id ? { ...r, status: request.status } : r)
      );


      toast.error(getErrorMessage(error, "Could not update request"));


    } finally {


      setProcessingId(null);



    }


  };


  return (
    <div>

      <h1 className="mb-6 text-2xl font-semibold">Rental Requests</h1>

      {isLoading ? (

        <div className="space-y-3">

          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />

          ))}
        </div>

      ) : requests.length === 0 ? (

        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          No rental requests yet.
        </div>
      ) : (

        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >

              <div>

                <p className="font-medium">{request.property.title}</p>

                <p className="text-sm text-muted-foreground">

                  {request.tenant?.name} ({request.tenant?.email}) · Move-in{" "}
                  {new Date(request.moveInDate).toLocaleDateString()} ·{" "}
                  {request.leaseDuration} months

                </p>
                {request.message && (
                  <p className="mt-1 text-sm italic text-muted-foreground">
                    &quot;{request.message}&quot;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">


                <RentalStatusBadge status={request.status} />

                {request.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleDecision(request, "approve")}
                      disabled={processingId === request.id}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecision(request, "reject")}
                      disabled={processingId === request.id}
                    >
                      Reject
                    </Button>

                  </>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
    
  );
}