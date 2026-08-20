"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";






const navItems = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/properties", label: "Properties" },
];

export default function AdminDashboardLayout({children}: { children: React.ReactNode;}) {



  const pathname = usePathname();



  return (
    <div className="mx-auto max-w-6xl px-4 py-8">

      <nav className="mb-8 flex gap-1 border-b">

        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard/admin"
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