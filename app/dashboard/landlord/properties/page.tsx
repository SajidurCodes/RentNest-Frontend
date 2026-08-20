// app/dashboard/landlord/properties/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { propertyService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { getDecodedToken } from "@/lib/auth";
import { Property } from "@/types";
import { cn } from "@/lib/utils";

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Tracks which property's availability toggle is mid-request, so we can
  // disable just that one button instead of freezing the whole page.
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProperties = async () => {
      const user = getDecodedToken();
      if (!user) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const res = await propertyService.getMyProperties(user.id);
        if (!cancelled) setProperties(res.data.data);
      } catch (error) {
        if (!cancelled) {
          toast.error(getErrorMessage(error, "Could not load your properties"));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleAvailability = async (property: Property) => {
    setTogglingId(property.id);
    // Optimistic update — flip it in the UI immediately, revert if the API call fails
    setProperties((prev) =>
      prev.map((p) =>
        p.id === property.id ? { ...p, isAvailable: !p.isAvailable } : p
      )
    );
    try {
      await propertyService.update(property.id, {
        isAvailable: !property.isAvailable,
      });
      toast.success("Availability updated");
    } catch (error) {
      // Revert on failure
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, isAvailable: property.isAvailable } : p
        )
      );
      toast.error(getErrorMessage(error, "Could not update availability"));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await propertyService.remove(deleteTarget.id);
      toast.success("Property deleted");
      setProperties((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete property"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Properties</h1>
        <Link
          href="/dashboard/landlord/properties/new"
          className={cn(buttonVariants())}
        >
          + New Property
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t listed any properties yet.
          </p>
          <Link
            href="/dashboard/landlord/properties/new"
            className={cn(buttonVariants(), "mt-3")}
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{property.title}</p>
                <p className="text-sm text-muted-foreground">
                  {property.address}, {property.city} · {property.rentAmount?.toLocaleString() ?? "—"}/mo
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  className="cursor-pointer select-none"
                  variant={property.isAvailable ? "default" : "secondary"}
                  onClick={() => handleToggleAvailability(property)}
                  aria-disabled={togglingId === property.id}
                >
                  {property.isAvailable ? "Available" : "Unavailable"}
                </Badge>

                <Link
                  href={`/dashboard/landlord/properties/${property.id}/edit`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" })
                  )}
                  aria-label="Edit property"
                >
                  <Pencil className="h-4 w-4" />
                </Link>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteTarget(property)}
                  aria-label="Delete property"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this property?</DialogTitle>
            <DialogDescription>
              This will permanently remove &quot;{deleteTarget?.title}&quot;. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}