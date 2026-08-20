import { apiClient } from "./api-client";
import {ApiResponse,Category,Payment,Property,RentalRequest,Review,User} from "@/types";




export const authService ={
  register: (data: {name: string; email: string; password: string;role: "TENANT" | "LANDLORD";phone?: string;}) => apiClient.post<ApiResponse<User>>("/auth/register", data),


  login: (data: { email: string; password: string }) =>apiClient.post<ApiResponse<{ accessToken: string;refreshToken: string }>>("/auth/login",data),

  me: () => apiClient.get<ApiResponse<User>>("/auth/me"),
};


export const propertyService = {



  getAll: (params?: Record<string, string | number | undefined>) =>
apiClient.get<ApiResponse<Property[]>>("/properties", { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Property>>(`/properties/${id}`),


  create: (data: Partial<Property>) =>
    apiClient.post<ApiResponse<Property>>("/properties/landlord", data),


  update: (id: string, data: Partial<Property>) =>
    apiClient.patch<ApiResponse<Property>>(`/properties/landlord/${id}`, data),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/properties/landlord/${id}`),



  getMyProperties: (landlordId: string) =>
    apiClient.get<ApiResponse<Property[]>>(
      `/properties/landlord/my/properties/${landlordId}`



    ),
};


export const categoryService = {

  getAll: () => apiClient.get<ApiResponse<Category[]>>("/categories"),


};


export const rentalService = {
  create: (data: {propertyId: string;moveInDate: string;leaseDuration: number;message?: string;
  }) => apiClient.post<ApiResponse<RentalRequest>>("/rentals/tenant", data),

  getMine: () =>
    apiClient.get<ApiResponse<RentalRequest[]>>("/rentals/tenant"),

  getById: (id: string) =>
    apiClient.get<ApiResponse<RentalRequest>>(`/rentals/${id}`),

  
  getLandlordRequests: () =>
    apiClient.get<ApiResponse<RentalRequest[]>>("/rentals/landlord/requests"),

  approve: (id: string) =>
    apiClient.patch<ApiResponse<RentalRequest>>(
      `/rentals/landlord/approve/${id}`
    ),




  reject: (id: string) =>
    apiClient.patch<ApiResponse<RentalRequest>>(
      `/rentals/landlord/reject/${id}`
    ),



};




export const paymentService = {create: (rentalRequestId: string) =>
  apiClient.post<ApiResponse<{ paymentUrl: string; payment: unknown }>>(
    "/payments/create",
    { rentalRequestId }
  ),

  getMine: () => apiClient.get<ApiResponse<Payment[]>>("/payments"),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Payment>>(`/payments/${id}`),



};


export const reviewService = {create: (data: { propertyId: string; rating: number; comment: string }) =>
    apiClient.post<ApiResponse<Review>>("/reviews", data),

  getForProperty: (propertyId: string) => apiClient.get<ApiResponse<Review[]>>(`/reviews/property/${propertyId}`),
};


export const adminService = {


  getUsers: (params?: Record<string, string | number | undefined>) =>

    apiClient.get<ApiResponse<User[]>>("/users/admin", { params }),


  banUser: (userId: string) =>

    apiClient.patch<ApiResponse<null>>(`/users/admin/ban/${userId}`),


  unbanUser: (userId: string) =>
    apiClient.patch<ApiResponse<null>>(`/users/admin/unban/${userId}`),


};


export const userService = {


  getMe: () => apiClient.get<ApiResponse<User>>("/users/me"),



  updateMe: (data: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>("/users/me", data),

  
};