
"use client";


import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,DropdownMenuSeparator} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getDecodedToken, removeToken } from "@/lib/auth";
import { DecodedToken } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";






const authListeners = new Set<() => void>();

let authSnapshot: DecodedToken | null = null;

let authInitialized = false;


const getAuthSnapshot = () => {

  if (!authInitialized) {

    authSnapshot = getDecodedToken();

    authInitialized = true;

  }


  return authSnapshot;

};


const subscribeToAuth = (listener: () => void) => {

  authListeners.add(listener);

  return () => authListeners.delete(listener);


};


const getServerAuthSnapshot = () => null;


const notifyAuthChange = () => {
  authSnapshot = getDecodedToken();
  authInitialized = true;
  authListeners.forEach((x) => x());
};

export function Navbar() {


  const router = useRouter();

  const user = useSyncExternalStore(subscribeToAuth,getAuthSnapshot,getServerAuthSnapshot);

  const handleLogout = () => {


    removeToken();


    notifyAuthChange();

    toast.success("Logged out");

    router.push("/");

    router.refresh();
  };

  const dashboardLink =

    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "LANDLORD"
      ? "/dashboard/landlord"
      : "/dashboard/tenant";





  return (




    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Home className="h-5 w-5" />
          RentNest
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/properties" className="hover:underline">
            Browse Properties
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>{user.role.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user.role}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                
                <DropdownMenuItem onClick={() => router.push(dashboardLink)}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Log In
              </Link>
              <Link href="/auth/register" className={cn(buttonVariants())}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );



}