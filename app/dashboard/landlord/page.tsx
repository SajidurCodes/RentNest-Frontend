"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Building2, Clock, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { propertyService, rentalService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { getDecodedToken } from "@/lib/auth";




export default function LandlordOverviewPage() {

  const [stats, setStats] = useState({

    totalProperties: 0,
    pendingRequests: 0,
    activeRequests: 0,

  });


  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {


    async function loadStats() {


      const user = getDecodedToken();

      if (!user) {return;}


      try {


        const [propertiesRes, requestsRes] = await Promise.all([
          propertyService.getMyProperties(user.id),

          rentalService.getLandlordRequests(),


        ]);



        const requests = requestsRes.data.data;



        setStats({

          totalProperties: propertiesRes.data.data.length,

          pendingRequests: requests.filter((r) => r.status === "PENDING").length,

          activeRequests: requests.filter(
            (r) => r.status === "APPROVED" || r.status === "ACTIVE"
          ).length,

        });


      } catch (error) {


        toast.error(getErrorMessage(error, "Could not load your overview"));


      } finally {

        setIsLoading(false);

      }
    }



    loadStats();


  }, []);



  const cards = [
    {
      label: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests,
      icon: Clock,
    },
    {
      label: "Active / Approved Requests",
      value: stats.activeRequests,
      icon: ListChecks,
    },
  ];




  return (
    <div>


      <h1 className="mb-6 text-2xl font-semibold">Landlord Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {cards.map((card) => (
          <Card key={card.label}>
            
            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>

              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>


            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{card.value}</p>
              )}
            </CardContent>


          </Card>
          
        ))}


      </div>


    </div>


  );
}