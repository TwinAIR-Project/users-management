import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '../ui/button';
import { UpdateUser } from '../dialogs/update-user';
import { ViewUser } from '../dialogs/view-user';
import { DeleteUser } from '../dialogs/delete-user';
import { useUsers } from '@/app/contexts/UsersContext';

const tableHeaders = [
  { label: 'Identifier', icon: 'ic:baseline-vpn-key' },
  { label: 'Username', icon: null },
  { label: 'Email', icon: 'entypo:email' },
  { label: 'Enabled', icon: null },
  { label: 'Actions', icon: 'mingcute:more-1-fill' },
];

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TableActions = ({
  user, editUser, viewUser, deleteUser,
}) => (
  <div className="flex gap-2 px-4 py-2 text-gray-700">
    <Button onClick={() => editUser(user)} className="!m-0 !p-0 rounded-md w-6 h-6" size="icon">
      <Icon icon="ci:edit-pencil-line-01" className="mr-0 w-2 h-2" style={{ color: 'white' }} />
    </Button>
    <Button onClick={() => viewUser(user)} className="!m-0 !p-0 rounded-md w-6 h-6" size="icon">
      <Icon icon="prime:eye" className="mr-0 w-2 h-2" style={{ color: 'white' }} />
    </Button>
    <Button
      onClick={() => deleteUser(user)}
      className="bg-red-500 !m-0 !p-0 border-red-600 rounded-md w-6 h-6"
      size="icon"
    >
      <Icon icon="material-symbols:delete-outline" className="mr-0 w-2 h-2" style={{ color: 'white' }} />
    </Button>
  </div>
);

export const UsersTable = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { users, loading } = useUsers();

  const editUser = (user) => {
    setIsViewing(false);
    setIsDeleting(false);
    setSelectedUser(user);
    setIsEditing(true);
  };

  const viewUser = (user) => {
    setIsEditing(false);
    setIsDeleting(false);
    setSelectedUser(user);
    setIsViewing(true);
  };

  const deleteUser = (user) => {
    setIsEditing(false);
    setIsViewing(false);
    setSelectedUser(user);
    setIsDeleting(true);
  };

  return (
    <div className="rounded-lg overflow-x-auto overflow-y-auto">
      <Table className="border-gray-200 bg-white border rounded-2xl min-w-full overflow-auto">
        <TableHeader className="bg-gray-100">
          <TableRow>
            {tableHeaders.map(({ label, icon }, index) => (
              <TableHead
                key={`header-${index + 1}`}
                className={`px-4 py-2 font-semibold text-gray-600 text-left 
                  ${icon ? 'flex items-center gap-2' : ''}
                   sticky top-0 bg-gray-100 z-10`}
              >
                {icon && <Icon icon={icon} className="text-gray-600" />}
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={`row-${index + 1}`} className="border-gray-200 border-t">
                <TableCell className="px-4 py-2"><Skeleton className="w-16 h-5" /></TableCell>
                <TableCell className="px-4 py-2"><Skeleton className="w-24 h-5" /></TableCell>
                <TableCell className="px-4 py-2"><Skeleton className="w-32 h-5" /></TableCell>
                <TableCell className="px-4 py-2"><Skeleton className="w-12 h-5" /></TableCell>
                <TableCell className="flex gap-2 px-4 py-2">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="w-6 h-6" />
                </TableCell>
              </TableRow>
            ))
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="border-gray-200 hover:bg-gray-50 border-t">
                <TableCell className="flex items-center gap-2 px-4 py-2 font-medium text-gray-700">
                  <div className="flex justify-center items-center bg-zinc-600 rounded-full w-7 h-7">
                    <Icon icon="charm:person" className="text-white" />
                  </div>
                  {user?.id}
                </TableCell>
                <TableCell className="px-4 py-2 font-semibold text-gray-700">{user.username}</TableCell>
                <TableCell className="px-4 py-2 text-gray-700">{user?.email}</TableCell>
                <TableCell className="px-4 py-2 text-gray-700">
                  <Switch checked={user?.enabled} onChange={() => { }} />
                </TableCell>
                <TableCell className="flex gap-2 px-4 py-2 text-gray-700">
                  <TableActions user={user} editUser={editUser} viewUser={viewUser} deleteUser={deleteUser} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <UpdateUser
        userId={selectedUser?.id ?? null}
        isDialogOpen={isEditing}
        setIsDialogOpen={setIsEditing}
      />
      <ViewUser
        userId={selectedUser?.id ?? null}
        isDialogOpen={isViewing}
        setIsDialogOpen={setIsViewing}
      />
      <DeleteUser
        user={selectedUser}
        isDialogOpen={isDeleting}
        setIsDialogOpen={setIsDeleting}
      />
    </div>
  );
};
