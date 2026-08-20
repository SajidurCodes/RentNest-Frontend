"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { adminService } from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { User } from "@/types";







const PAGE_SIZE = 10;



export default function AdminUsersPage() {



  const [users, setUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState<string>("all");


  const [page, setPage] = useState(1);

  
  const [processingId, setProcessingId] = useState<string | null>(null);


  const loadUsers = useCallback(async () => {

    setIsLoading(true);

    try {


      const res = await adminService.getUsers({search: search || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
      });


      setUsers(res.data.data);


    } catch (error) {


      toast.error(getErrorMessage(error, "Could not load users"));


    } finally {


      setIsLoading(false);


    }
  }, [search, roleFilter]);



  useEffect(() => {


    const timeoutId = window.setTimeout(() => {
      void loadUsers();
    }, 0);


    return () => window.clearTimeout(timeoutId);


  }, [loadUsers]);

  const handleToggleBan = async (user: User) => {


    setProcessingId(user.id);

    const wasBanned = user.isBanned;


   
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isBanned: !wasBanned } : u))
    );



    try {


      if (wasBanned) {

        await adminService.unbanUser(user.id);
        toast.success(`${user.name} has been unbanned`);


      } else {

        await adminService.banUser(user.id);
        toast.success(`${user.name} has been banned`);
      }

    } catch (error) {

     
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBanned: wasBanned } : u))
      );


      toast.error(getErrorMessage(error, "Could not update user status"));


    } finally {


      setProcessingId(null);


    }
  };

  
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

  const paginatedUsers = users.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );



  return (
    <div>

      <h1 className="mb-6 text-2xl font-semibold">User Management</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">

        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />


        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v ?? "all");
            setPage(1);
          }}
        >

          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="TENANT">Tenant</SelectItem>
            <SelectItem value="LANDLORD">Landlord</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>


      </div>

      {isLoading ? (

        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          No users found.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>


                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3 text-muted-foreground">{user.email}</td>
                    <td className="p-3">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={user.isBanned ? "destructive" : "default"}>
                        {user.isBanned ? "Banned" : "Active"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {user.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant={user.isBanned ? "outline" : "destructive"}
                          disabled={processingId === user.id}
                          onClick={() => handleToggleBan(user)}
                        >
                          {user.isBanned ? "Unban" : "Ban"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}

                
              </tbody>
            </table>
          </div>

        
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>

              </div>

            </div>

          )}
        </>
      )}



    </div>



  );
}