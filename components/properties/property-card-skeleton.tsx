import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {



  return (


    <div className="space-y-3">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>


  );


}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {


  return (


    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}

    </div>

  );
  
}