"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { categoryService, propertyService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { Property } from "@/types";
import { Category } from "@/types";





const propertySchema = z.object({


  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(2, "Address is required"),
  city: z.string().min(2, "City is required"),
  rentAmount: z.coerce.number().min(1, "Rent must be greater than 0"),
  bedrooms: z.coerce.number().min(0, "Enter a valid number"),
  bathrooms: z.coerce.number().min(0, "Enter a valid number"),
  propertyType: z.string().min(2, "Property type is required"),
  categoryId: z.string().min(1, "Please select a category"),


});



type PropertyFormInput = z.input<typeof propertySchema>;


type PropertyFormValues = z.output<typeof propertySchema>;


export function PropertyForm({ property }: { property?: Property }) {


  const router = useRouter();

  const isEditMode = !!property;


  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);


  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => setCategories(res.data.data))
      .catch(() => toast.error("Could not load categories"));
  }, []);



  const {register,handleSubmit,control,formState: { errors }} = useForm<PropertyFormInput, unknown, PropertyFormValues>({
    resolver: zodResolver(propertySchema),


    defaultValues: {


      title: property?.title ?? "",

      description: property?.description ?? "",

      address: property?.address ?? "",
      city: property?.city ?? "",
      rentAmount: property?.rentAmount ?? 0,
      bedrooms: property?.bedrooms ?? 1,
      bathrooms: property?.bathrooms ?? 1,
      propertyType: property?.propertyType ?? "",
      categoryId: property?.categoryId ?? property?.category?.id ?? "",
    }


  });


  const onSubmit = async (values: PropertyFormValues) => {

    setIsLoading(true);


    try {


      const payload = {


        title: values.title,
        description: values.description,
        address: values.address,
        city: values.city,
        rentAmount: values.rentAmount,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        propertyType: values.propertyType,
        categoryId: values.categoryId,


      };

      if (isEditMode) {

        await propertyService.update(property.id, payload);
        toast.success("Property updated successfully");


      } else {

        await propertyService.create(payload);
        toast.success("Property created successfully");


      }

      router.push("/dashboard/landlord/properties");

      router.refresh();


    } catch (error) {


      toast.error(getErrorMessage(
          error,
          isEditMode ? "Could not update property" : "Could not create property"
        )


      );


    } finally {


      setIsLoading(false);


    }
  };



  return (


    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Luxury Family Apartment" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>



      <div className="space-y-2">

        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the property..."
          rows={4}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>



      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="123 Main Street" {...register("address")} />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>



        <div className="space-y-2">

          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Dhaka" {...register("city")} />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

      </div>

      <div className="space-y-2">

        <Label htmlFor="propertyType">Property Type</Label>
        <Input
          id="propertyType"
          placeholder="Apartment"
          {...register("propertyType")}
        />
        {errors.propertyType && (
          <p className="text-sm text-destructive">{errors.propertyType.message}</p>
        )}

      </div>


      <div className="grid grid-cols-3 gap-3">


        <div className="space-y-2">
          <Label htmlFor="rentAmount">Rent (৳/mo)</Label>
          <Input id="rentAmount" type="number" {...register("rentAmount")} />
          {errors.rentAmount && (
            <p className="text-sm text-destructive">{errors.rentAmount.message}</p>
          )}
        </div>



        <div className="space-y-2">


          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" type="number" {...register("bedrooms")} />
          {errors.bedrooms && (
            <p className="text-sm text-destructive">{errors.bedrooms.message}</p>
          )}
        </div>


        <div className="space-y-2">

          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" type="number" {...register("bathrooms")} />
          {errors.bathrooms && (
            <p className="text-sm text-destructive">{errors.bathrooms.message}</p>
          )}

        </div>


      </div>



      <div className="space-y-2">


        <Label htmlFor="categoryId">Category</Label>


        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="categoryId" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>


            </Select>



          )}
        />
        {errors.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId.message}</p>
        )}
      </div>



      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? isEditMode
            ? "Saving..."
            : "Creating..."
          : isEditMode
          ? "Save Changes"
          : "Create Property"}
      </Button>


      
    </form>
  );
}