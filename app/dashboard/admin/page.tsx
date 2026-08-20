"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Building2, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService, propertyService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";












export default function AdminOverviewPage() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    bannedUsers: 0,
    totalProperties: 0,
  });


  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    async function loadStats() {

      try {

        const [usersRes, propertiesRes] = await Promise.all([
          adminService.getUsers(),
          propertyService.getAll({ limit: 1 }), 
        ]);


        const users = usersRes.data.data;


        setStats({
          totalUsers: users.length,
          bannedUsers: users.filter((u) => u.isBanned).length,
          totalProperties: propertiesRes.data.meta?.total ?? 0,
        });

      } catch (error) {

        toast.error(getErrorMessage(error, "Could not load platform stats"));

      } finally {

        setIsLoading(false);

      }

    }

    loadStats();

  }, []);

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Banned Users", value: stats.bannedUsers, icon: UserX },
    { label: "Total Properties", value: stats.totalProperties, icon: Building2 },
  ];




  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Admin Overview</h1>

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