"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyGridSkeleton } from "@/components/properties/property-card-skeleton";
import { propertyService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { Property } from "@/types";




export default function AdminPropertiesPage() {


  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    
    propertyService
      .getAll({ limit: 50 })
      .then((res) => setProperties(res.data.data))
      .catch((err) =>
        toast.error(getErrorMessage(err, "Could not load properties"))
      )
      .finally(() => setIsLoading(false));
  }, []);



  return (
    <div>

      <h1 className="mb-2 text-2xl font-semibold">All Properties</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Read-only view for moderation purposes across the whole platform.
      </p>

      {isLoading ? (
        <PropertyGridSkeleton count={6} />
      ) : properties.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          No properties on the platform yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}

        </div>

      )}

    </div>

    


  );
}