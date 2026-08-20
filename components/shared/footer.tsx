import Link from "next/link";
import { GitBranch, Home, Mail } from "lucide-react";




export function Footer() {



  return (


    <footer className="border-t bg-muted/30">


      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Home className="h-5 w-5" />
              RentNest
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Find & list rental properties with ease.
            </p>
          </div>



          
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="hover:text-foreground hover:underline"
                >
                  Browse Properties
                </Link>
              </li>
            </ul>
          </div>



         
          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-foreground hover:underline"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="hover:text-foreground hover:underline"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

        


          <div>
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="mt-3 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="GitHub"
              >
                <GitBranch className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@rentnest.com"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>



        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RentNest. All rights reserved.
        </div>


        
      </div>
    </footer>




  );

}