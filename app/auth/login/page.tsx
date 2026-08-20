"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { authService } from "@/lib/services";
import { saveToken, getDecodedToken } from "@/lib/auth";






const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});



type LoginFormValues = z.infer<typeof loginSchema>;



export default function LoginPage() {


  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {register,handleSubmit,formState: { errors }} = useForm<LoginFormValues>({resolver: zodResolver(loginSchema)});



  const onSubmit = async (values: LoginFormValues) => {


    setIsLoading(true);


    try {


      const res = await authService.login(values);

      const { accessToken } = res.data.data;


      saveToken(accessToken);


      
      const decoded = getDecodedToken();
      toast.success("Logged in successfully!");


      if (decoded?.role === "ADMIN") {

        router.push("/dashboard/admin");

      } else if (decoded?.role === "LANDLORD") {

        router.push("/dashboard/landlord");

      } else {

        router.push("/dashboard/tenant");

      }
      router.refresh(); 

    } catch (error) {

      toast.error(getErrorMessage(error, "Login failed. Check your credentials."));

      
    } finally {

      setIsLoading(false);

    }


  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">


      <Card className="w-full max-w-md">

        <CardHeader>

          <CardTitle className="text-2xl">Welcome back</CardTitle>

          <CardDescription>Log in to your RentNest account</CardDescription>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-2">

              <Label htmlFor="email">Email</Label>
              
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />


              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>

              )}

            </div>


            <div className="space-y-2">

              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>



            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>


          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="underline underline-offset-4"
            >
              Register
            </Link>

          </p>

        </CardContent>

      </Card>

    </div>
    
  );
}