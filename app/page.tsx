"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyGridSkeleton } from "@/components/properties/property-card-skeleton";
import { propertyService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { Property } from "@/types";
import { cn } from "@/lib/utils";











export default function HomePage() {


  const [properties, setProperties] = useState<Property[]>([]);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {


    async function loadFeatured() {

      try {

        const res = await propertyService.getAll({ limit: 6 });
        setProperties(res.data.data);

      } catch (error) {

        toast.error(getErrorMessage(error, "Could not load properties"));
      } finally {

        setIsLoading(false);

      }

    }

    loadFeatured();

  }, []);


  return (
    <main>



      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next home with RentNest
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Browse verified rental listings, request to rent, and pay
            securely — all in one place.
          </p>
          <Link
            href="/properties"
            className={cn(buttonVariants({ size: "lg" }), "mt-6")}
          >
            Browse Properties
          </Link>
        </div>
      </section>








      {/* Featured properties */}


      <section className="mx-auto max-w-7xl px-4 py-12">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-semibold">Featured Properties</h2>
          <Link
            href="/properties"
            className="text-sm text-muted-foreground hover:underline"
          >
            View all →
          </Link>

        </div>

        {isLoading ? (
          <PropertyGridSkeleton count={6} />
        ) : properties.length === 0 ? (
          <p className="text-muted-foreground">
            No properties available right now. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>


      
    </main>
  );
}