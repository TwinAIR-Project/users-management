import React from 'react';

import { PlusCircle } from 'lucide-react';

import { toast } from 'sonner';
import { DateTime } from 'luxon';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

import { CreateUserForm } from '../forms/create-user-form';
import { useUsers } from '@/app/contexts/UsersContext';

export const CreateUser = ({ isDialogOpen, setIsDialogOpen }) => {
  const { createUser, fetchUsers } = useUsers();

  const onSubmit = async (_user) => {
    try {
      const data = await createUser(_user);
      if (data?.error) {
        toast.error(data.message.message, {
          description: DateTime.now().toLocaleString(DateTime.DATETIME_MED),
        });
        return;
      }
      toast.success(data.message, {
        description: DateTime.now().toLocaleString(DateTime.DATETIME_MED),
      });

      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          <PlusCircle className="mr-0 w-4 h-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <CreateUserForm onSubmit={onSubmit}>
          <Button
            className="!mt-4 w-full"
            type="submit"
          >
            Add User
          </Button>
        </CreateUserForm>
      </DialogContent>
    </Dialog>
  );
};

