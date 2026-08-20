"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyForm } from "@/components/dashboard/property-form";
import { propertyService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { Property } from "@/types";







export default function EditPropertyPage({params}: {params: Promise<{ id: string }>;}) {


  const { id } = use(params);

  const [property, setProperty] = useState<Property | null>(null);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {

    propertyService
      .getById(id)
      .then((res) => setProperty(res.data.data))
      .catch((err) => toast.error(getErrorMessage(err, "Could not load property")))
      .finally(() => setIsLoading(false));


  }, [id]);


  if (isLoading) {

    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );

  }

  if (!property) {

    return <p className="text-muted-foreground">Property not found.</p>;

  }

  return (
    <div>

      <h1 className="mb-6 text-2xl font-semibold">Edit Property</h1>
      <PropertyForm property={property} />
      
    </div>
  );
}