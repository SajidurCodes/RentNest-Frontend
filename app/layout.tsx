import type { Metadata } from "next";


import "./globals.css";
import { Navbar } from "@/components/shared/navbar";

import "./globals.css";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/sonner";



export const metadata: Metadata = {

  title: "RentNest — Find & List Rental Properties",
  description: "A modern rental property marketplace.",

};





export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="en">


      <body>

        <Navbar />

        {children}

        <Footer />

        <Toaster richColors position="top-center" />

      </body>

    </html>

    
  );
}