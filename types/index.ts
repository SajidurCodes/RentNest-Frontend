export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";




export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";




export interface User {


  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isBanned?: boolean;
  profilePhoto?: string;
  createdAt?: string;



}

export interface Category {


  id: string;
  name: string;

}

export interface Property {


  id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  rentAmount?: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  isAvailable: boolean;
  category?: Category;
  categoryId?: string;
  landlord?: {
    id: string;
    name: string;
    email?: string;
  };
  createdAt?: string;


}

export interface RentalRequest {


  id: string;
  status: RentalStatus;
  moveInDate: string;
  leaseDuration: number;
  message?: string;
  property: {
    id: string;
    title: string;
    location?: string;
  };
  tenant?: {
    id: string;
    name: string;
    email?: string;
  };


}


export interface Payment {


  id: string;
  amount: number;
  status: PaymentStatus;
  provider: string;
  transactionId: string | null;
  paidAt: string | null;
  rentalRequestId?: string;


}

export interface Review {


  id: string;
  rating: number;
  comment: string;
  tenant?: {
    name: string;
  };
  createdAt: string;


}

export interface ApiResponse<T> {


  success: boolean;

  message: string;

  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };


}

export interface DecodedToken {


  id: string;
  role: UserRole;

  email?: string;

  iat: number;
  exp: number;

  
}