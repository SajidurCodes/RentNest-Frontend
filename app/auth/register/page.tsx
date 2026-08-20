"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { getErrorMessage } from "@/lib/error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { authService } from "@/lib/services";




const registerSchema = z.object({

  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD"], {
    message: "Please select a role",
  }),
  phone: z.string().optional(),

});


type RegisterFormValues = z.infer<typeof registerSchema>;


export default function RegisterPage() {


  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const {register,handleSubmit,control,formState: { errors }} = useForm<RegisterFormValues>({resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "TENANT",
    }

  });


  const onSubmit = async (values: RegisterFormValues) => {


    setIsLoading(true);

    try {

      await authService.register(values);
      toast.success("Account created! Please log in.");
      router.push("/auth/login");

    } catch (error) {

      toast.error(getErrorMessage(error, "Registration failed. Try again."));

    } finally {

      setIsLoading(false);

    }

  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">

      <Card className="w-full max-w-md">

        <CardHeader>

          <CardTitle className="text-2xl">Create your account</CardTitle>

          <CardDescription>
            Join RentNest as a tenant or a landlord
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>

              <Input id="name" placeholder="John Doe" {...register("name")} />


              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>




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



            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                placeholder="01700000000"
                {...register("phone")}
              />
            </div>


            <div className="space-y-2">

              <Label htmlFor="role">I am a...</Label>

              <Controller
                name="role"
                control={control}
                render={({ field }) => (

                  <Select value={field.value} onValueChange={field.onChange}>

                    <SelectTrigger id="role" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>


                    <SelectContent>
                      <SelectItem value="TENANT">
                        Tenant — I want to rent a property
                      </SelectItem>
                      <SelectItem value="LANDLORD">
                        Landlord — I want to list properties
                      </SelectItem>
                    </SelectContent>
                  </Select>

                )}
              />
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Log in
            </Link>
          </p>
        </CardContent>


      </Card>


    </div>

    
  );
}