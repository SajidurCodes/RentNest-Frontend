"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Bed, Bath, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { propertyService, reviewService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { Property, Review } from "@/types";
import { RequestRentalDialog } from "@/components/properties/request-rental-dialog";





export default function PropertyDetailsPage({params}: {params: Promise<{ id: string }>;}) {


  const { id } = use(params);

  const [property, setProperty] = useState<Property | null>(null);


  const [reviews, setReviews] = useState<Review[]>([]);


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {


    async function load() {


      setIsLoading(true);


      try {


        const [propertyRes, reviewsRes] = await Promise.all([propertyService.getById(id),reviewService.getForProperty(id),]);
        setProperty(propertyRes.data.data);

        setReviews(reviewsRes.data.data);


      } catch (error) {


        toast.error(getErrorMessage(error, "Could not load this property"));



      } finally {


        setIsLoading(false);


      }
    }


    load();


  }, [id]);



  if (isLoading) {


    return (

      <main className="mx-auto max-w-5xl px-4 py-8">

        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="mt-6 h-8 w-1/2" />
        <Skeleton className="mt-2 h-4 w-1/3" />

      </main>
    );

  }


  if (!property) {

    return (

      <main className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">
        Property not found.
      </main>


    );


  }



  return (



    <main className="mx-auto max-w-5xl px-4 py-8">

      {/* Header */}

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {property.address}, {property.city}
          </p>
        </div>
        <Badge variant={property.isAvailable ? "default" : "secondary"}>
          {property.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </div>



      <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Bed className="h-4 w-4" /> {property.bedrooms} Bedrooms
        </span>
        <span className="flex items-center gap-1">
          <Bath className="h-4 w-4" /> {property.bathrooms} Bathrooms
        </span>
        {property.category && <Badge variant="outline">{property.category.name}</Badge>}
      </div>




      <p className="mt-2 text-xl font-semibold">
        {property.rentAmount != null ? (
          <>
            ৳{property.rentAmount.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          </>
        ) : (
          "Rent unavailable"
        )}
      </p>


      <Separator className="my-6" />



      {/* Description */}
      <section>
        <h2 className="mb-2 text-lg font-semibold">Description</h2>
        <p className="text-muted-foreground">
          {property.description || "No description provided."}
        </p>
      </section>


      <Separator className="my-6" />


      
      <section className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="text-sm text-muted-foreground">Listed by</p>
          <p className="font-medium">{property.landlord?.name || "Unknown"}</p>
        </div>
        <RequestRentalDialog
          propertyId={property.id}
          isAvailable={property.isAvailable}
        />
      </section>

      <Separator className="my-6" />



      {/* Reviews */}

      <section>

        <h2 className="mb-3 text-lg font-semibold">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{review.tenant?.name || "Tenant"}</p>
                  <span className="text-sm text-muted-foreground">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}


      </section>


    </main>




  );
}