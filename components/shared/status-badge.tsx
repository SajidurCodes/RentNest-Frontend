

import { Badge } from "@/components/ui/badge";
import { RentalStatus, PaymentStatus } from "@/types";
import { cn } from "@/lib/utils";


const rentalStatusStyles: Record<RentalStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
  COMPLETED: "bg-gray-100 text-gray-700 hover:bg-gray-100",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100",
  FAILED: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return (
    <Badge className={cn("border-0", rentalStatusStyles[status])}>
      {status}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge className={cn("border-0", paymentStatusStyles[status])}>
      {status}
    </Badge>
  );
}