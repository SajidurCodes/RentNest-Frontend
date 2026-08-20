"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyGridSkeleton } from "@/components/properties/property-card-skeleton";
import {PropertyFilters,FilterValues,emptyFilters,} from "@/components/properties/property-filters";
import { propertyService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { Property } from "@/types";






export default function PropertiesPage() {

  const [properties, setProperties] = useState<Property[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterValues>(emptyFilters);


  const fetchProperties = useCallback(async (currentFilters: FilterValues) => {


    setIsLoading(true);


    try {


      const params: Record<string, string | number | undefined> = {

        search: currentFilters.search || undefined,
        category:
          currentFilters.category !== "all" ? currentFilters.category : undefined,
        minPrice: currentFilters.minPrice || undefined,
        maxPrice: currentFilters.maxPrice || undefined,
        bedrooms:
          currentFilters.bedrooms !== "any" ? currentFilters.bedrooms : undefined,
        bathrooms:
          currentFilters.bathrooms !== "any"
            ? currentFilters.bathrooms
            : undefined,

      };



      const res = await propertyService.getAll(params);

      setProperties(res.data.data);


    } catch (error) {


      toast.error(getErrorMessage(error, "Could not load properties"));



    } finally {


      setIsLoading(false);



    }



  }, []);

  useEffect(() => {

    const loadProperties = async () => {
      await fetchProperties(emptyFilters);
    };



    void loadProperties();


  }, [fetchProperties]);



  const handleApply = (values: FilterValues) => {

    setFilters(values);

    fetchProperties(values);


  };



  return (


    <main className="mx-auto max-w-7xl px-4 py-8">

      <h1 className="mb-6 text-2xl font-semibold">Browse Properties</h1>


      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">

        <aside>
          <PropertyFilters initialValues={filters} onApply={handleApply} />
        </aside>


        

        <div>
          {isLoading ? (
            <PropertyGridSkeleton count={6} />
          ) : properties.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
              No properties match your filters. Try adjusting them.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>


      </div>



    </main>
  );
}