import Link from "next/link";
import { Bed, Bath, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/types";







export function PropertyCard({ property }: { property: Property }) {


  return (


    <Link href={`/properties/${property.id}`}>

      <Card className="overflow-hidden py-0 transition-shadow hover:shadow-md">

        <div className="relative aspect-[4/3] w-full bg-muted">
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Property listing
          </div>
          <Badge
            className="absolute right-2 top-2"
            variant={property.isAvailable ? "default" : "secondary"}
          >
            {property.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>



        <CardContent className="space-y-1 pt-4">


          <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {property.address}, {property.city}
          </p>


        </CardContent>

        <CardFooter className="flex items-center justify-between pb-4">


          <span className="font-semibold">
            {property.rentAmount != null
              ? property.rentAmount.toLocaleString()
              : "Rent unavailable"}
            <span className="text-sm font-normal text-muted-foreground">
              {property.rentAmount != null && "/mo"}
            </span>
          </span>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.bathrooms}
            </span>
          </div>


        </CardFooter>

        
      </Card>



    </Link>
  );
}