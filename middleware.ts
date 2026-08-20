import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  exp: number;
}
const roleRouteMap: Record<string, string> = {
  "/dashboard/tenant": "TENANT",
  "/dashboard/landlord": "LANDLORD",
  "/dashboard/admin": "ADMIN",
};
function getDashboardPathForRole(role: string) {


  if (role === "ADMIN"){ return "/dashboard/admin";}
  if (role === "LANDLORD"){ return "/dashboard/landlord";}
  return "/dashboard/tenant";


}
export function middleware(request: NextRequest) {




  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const matchedRoute = Object.keys(roleRouteMap).find((route) =>
    pathname.startsWith(route)
  );

 


  if (!matchedRoute) {
    return NextResponse.next();
  }



 

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    
    if (decoded.exp * 1000 < Date.now()) {


      const loginUrl = new URL("/auth/login", request.url);

      const response = NextResponse.redirect(loginUrl);


      response.cookies.delete("token");

      return response;
    }




    const requiredRole = roleRouteMap[matchedRoute];

    
    if (decoded.role !== requiredRole) {

      return NextResponse.redirect(

        new URL(getDashboardPathForRole(decoded.role), request.url)

      );

    }

    
    return NextResponse.next();

  } catch {

   
    const loginUrl = new URL("/auth/login", request.url);

    const response = NextResponse.redirect(loginUrl);

    response.cookies.delete("token");

    return response;


  }
}


export const config = {

  matcher: ["/dashboard/:path*"],

};
