"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { categoryService } from "@/lib/services";
import { Category } from "@/types";






export interface FilterValues {


  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;



}

const emptyFilters: FilterValues = {


  search: "",
  category: "all",
  minPrice: "",
  maxPrice: "",
  bedrooms: "any",
  bathrooms: "any",


};

export function PropertyFilters({initialValues,onApply,}: {initialValues: FilterValues; onApply: (values: FilterValues) => void;
}) {



  const [values, setValues] = useState<FilterValues>(initialValues);


  const [categories, setCategories] = useState<Category[]>([]);



  useEffect(() => {


    categoryService.getAll().then((res) => setCategories(res.data.data)).catch(() => {
      });



  }, []);

  const handleChange = (key: keyof FilterValues, value: string) => {


    setValues((prev) => ({ ...prev, [key]: value }));


  };


  const handleReset = () => {


    setValues(emptyFilters);


    onApply(emptyFilters);


  };

  return (



    <div className="space-y-5 rounded-lg border p-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Title or location..."
          value={values.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>



      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={values.category}
          onValueChange={(v) => handleChange("category", v ?? "all")}
        >
          <SelectTrigger className="w-full">


            <SelectValue />

          </SelectTrigger>


          <SelectContent>

            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}

              </SelectItem>

            ))}
          </SelectContent>


        </Select>


      </div>




      <div className="grid grid-cols-2 gap-2">


        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={values.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
        </div>



        <div className="space-y-2">

          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="Any"
            value={values.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />


        </div>




      </div>

      <div className="space-y-2">


        <Label>Bedrooms</Label>
        <Select
          value={values.bedrooms}
          onValueChange={(v) => handleChange("bedrooms", v ?? "any")}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {[1, 2, 3, 4, 5].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}+
              </SelectItem>
            ))}
          </SelectContent>
        </Select>


      </div>



      <div className="space-y-2">


        <Label>Bathrooms</Label>


        <Select
          value={values.bathrooms}
          onValueChange={(v) => handleChange("bathrooms", v ?? "any")}
        >
          <SelectTrigger className="w-full">

            <SelectValue />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="any">Any</SelectItem>



            {[1, 2, 3, 4].map((n) => (

              <SelectItem key={n} value={String(n)}>
                {n}+
              </SelectItem>


            ))}
          </SelectContent>


        </Select>


      </div>






      <div className="flex gap-2 pt-2">
        <Button className="flex-1" onClick={() => onApply(values)}>
          Apply Filters
        </Button>

        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>

      </div>


      
    </div>
  );
}

export { emptyFilters };