"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { rentalService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { getDecodedToken } from "@/lib/auth";












const requestSchema = z.object({

  moveInDate: z.string().min(1, "Move-in date is required"),
  leaseDuration: z.coerce.number().min(1, "Enter at least 1 month"),
  message: z.string().optional(),


});


type RequestFormValues = z.infer<typeof requestSchema>;


type RequestFormInput = z.input<typeof requestSchema>;


export function RequestRentalDialog({propertyId,isAvailable}: {propertyId: string;isAvailable: boolean;
}) {


  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);


  const {register,handleSubmit,reset,formState: { errors },} = useForm<RequestFormInput, unknown, RequestFormValues>({
    resolver: zodResolver(requestSchema),});

  const handleOpenChange = (nextOpen: boolean) => {
    
    if (nextOpen) {


      const user = getDecodedToken();


      if (!user) {


        toast.error("Please log in as a tenant to request this property.");
        router.push("/auth/login");


        return;

      }



      if (user.role !== "TENANT") {


        toast.error("Only tenant accounts can request to rent a property.");


        return;


      }
    }


    setOpen(nextOpen);


  };

  const onSubmit = async (values: RequestFormValues) => {



    setIsLoading(true);


    try {


      await rentalService.create({

        propertyId,
        moveInDate: values.moveInDate,
        leaseDuration: values.leaseDuration,
        message: values.message,
      });



      toast.success("Rental request submitted! Check your dashboard for updates.");


      reset();

      setOpen(false);


    } catch (error) 
    {

      toast.error(getErrorMessage(error, "Could not submit request"));


    } finally {


      setIsLoading(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
    
      <Button disabled={!isAvailable} onClick={() => handleOpenChange(true)}>

        {isAvailable ? "Request to Rent" : "Not Available"}


      </Button>


      <DialogContent>

        <DialogHeader>

          <DialogTitle>Request to Rent</DialogTitle>


        </DialogHeader>



        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-2">

            <Label htmlFor="moveInDate">Move-in Date</Label>

            <Input
              id="moveInDate"
              type="date"
              {...register("moveInDate")}
            />
            {errors.moveInDate && (
              <p className="text-sm text-destructive">
                {errors.moveInDate.message}
              </p>
            )}
          </div>





          <div className="space-y-2">


            <Label htmlFor="leaseDuration">Lease Duration (months)</Label>


            <Input
              id="leaseDuration"
              type="number"
              placeholder="12"
              {...register("leaseDuration")}
            />
            {errors.leaseDuration && (
              <p className="text-sm text-destructive">
                {errors.leaseDuration.message}
              </p>
            )}
          </div>




          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell the landlord a bit about yourself..."
              {...register("message")}
            />
          </div>




          <DialogFooter>


            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>




        </form>


      </DialogContent>


    </Dialog>
    
  );
}