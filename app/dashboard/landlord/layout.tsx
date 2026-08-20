"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";






const navItems = [
  { href: "/dashboard/landlord", label: "Overview" },
  { href: "/dashboard/landlord/properties", label: "My Properties" },
  { href: "/dashboard/landlord/requests", label: "Requests" },
];




export default function LandlordDashboardLayout({children,}: {children: React.ReactNode;}) {


  const pathname = usePathname();



  return (
    <div className="mx-auto max-w-6xl px-4 py-8">


      <nav className="mb-8 flex gap-1 border-b">
        
        {navItems.map((item) => {
         
          const isActive =
            item.href === "/dashboard/landlord"
              ? pathname === item.href
              : pathname.startsWith(item.href);


          return (


            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>

          );
        })}


      </nav>

      {children}

    </div>





  );
}