import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types";

const TOKEN_KEY = "token";




export function saveToken(token: string) {

  Cookies.set(TOKEN_KEY, token, {
    expires: 7,

    sameSite: "lax",


  });


}

export function getToken(): string | undefined {

  return Cookies.get(TOKEN_KEY);


}

export function removeToken() {


  Cookies.remove(TOKEN_KEY);


}

export function getDecodedToken(): DecodedToken | null {

  const token = getToken();

  if (!token) return null;


  try {


    const decoded = jwtDecode<DecodedToken>(token);

    
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();


      return null;

    }

    return decoded;


  } catch{


    return null;



  }
}

export function isAuthenticated(): boolean {

  return getDecodedToken() !== null;


  
}