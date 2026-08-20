"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";












const reviewSchema = z.object({

  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});





type ReviewFormValues = z.infer<typeof reviewSchema>;






export function LeaveReviewDialog({
  propertyId,
  onSubmitted,
}: {
  propertyId: string;
  onSubmitted?: () => void;
}) {


  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });



  const onSubmit = async (values: ReviewFormValues) => {

    setIsLoading(true);
    try {


      await reviewService.create({ propertyId, ...values });
      toast.success("Review submitted — thank you!");
      reset();
      setOpen(false);
      onSubmitted?.();


    } catch (error) {

      toast.error(getErrorMessage(error, "Could not submit review"));


    } finally {



      setIsLoading(false);



    }
  };




  return (


    <Dialog open={open} onOpenChange={setOpen}>


      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Leave Review
      </Button>



      <DialogContent>


        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>



        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


          <div className="space-y-2">


            <Label>Rating</Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          star <= field.value
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}


                </div>



              )}
            />


            {errors.rating && (
              <p className="text-sm text-destructive">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="How was your stay?"
              {...register("comment")}
            />
            {errors.comment && (
              <p className="text-sm text-destructive">
                {errors.comment.message}
              </p>
            )}
          </div>




          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>




        </form>




      </DialogContent>


      
    </Dialog>
  );
}