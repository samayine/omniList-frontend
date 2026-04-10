'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MoreHorizontal, Users, Building2, Trash2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { getAdminUsers, updateUserRoleApi, deleteUserApi } from '@/features/admin/api/admin-api';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UsersPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRoleApi(id, role),
    onSuccess: () => {
      toast.success('User role updated.');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
    onError: () => toast.error('Failed to update user role.'),
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      toast.success('User and related data deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    },
    onError: () => toast.error('Failed to delete user.'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-10 w-1/3 bg-muted rounded-lg animate-pulse" />
        <div className="h-96 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">User Management</h1>
        <p className="text-muted-foreground text-lg">
          View all registered users, manage roles, and moderate accounts.
        </p>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(!users || users.length === 0) ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No registered users yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCurrentUser = u.id === user?.id;
                  return (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {u.role === 'ADMIN' && (
                          <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20">Admin</Badge>
                        )}
                        {u.role === 'OWNER' && (
                          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20">Owner</Badge>
                        )}
                        {u.role === 'USER' && (
                          <Badge variant="secondary">User</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                        {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isCurrentUser ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent outline-none">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                              {u.role !== 'ADMIN' && (
                                <DropdownMenuItem
                                  onClick={() => changeRoleMutation.mutate({ id: u.id, role: 'ADMIN' })}
                                  className="cursor-pointer"
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" /> Promote to Admin
                                </DropdownMenuItem>
                              )}
                              {u.role !== 'OWNER' && (
                                <DropdownMenuItem
                                  onClick={() => changeRoleMutation.mutate({ id: u.id, role: 'OWNER' })}
                                  className="cursor-pointer"
                                >
                                  <Building2 className="h-4 w-4 mr-2" /> Set as Owner
                                </DropdownMenuItem>
                              )}
                              {u.role !== 'USER' && (
                                <DropdownMenuItem
                                  onClick={() => changeRoleMutation.mutate({ id: u.id, role: 'USER' })}
                                  className="cursor-pointer"
                                >
                                  <Users className="h-4 w-4 mr-2" /> Set as User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  if (confirm(`Delete ${u.email}? This will remove all their data.`)) {
                                    deleteUserMutation.mutate(u.id);
                                  }
                                }}
                                className="cursor-pointer text-red-500 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">You</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
