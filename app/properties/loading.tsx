import { PropertyGridSkeleton } from "@/components/properties/property-card-skeleton";

export default function PropertiesLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
        <PropertyGridSkeleton count={6} />
      </div>
    </main>
  );
}