import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";






export default function NotFound() {


  return (


    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">


      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-6")}>
        Go Home
      </Link>


      
    </main>
  );
}