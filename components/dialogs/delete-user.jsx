import React, { } from 'react';
import { toast } from 'sonner';
import { DateTime } from 'luxon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

import { Separator } from '../ui/separator';
import { useUsers } from '@/app/contexts/UsersContext';

export const DeleteUser = ({
  user, isDialogOpen, setIsDialogOpen,
}) => {
  const { fetchUsers, deleteUser } = useUsers();

  const handleDelete = async (userId) => {
    try {
      const data = await deleteUser(userId);
      if (data?.error) {
        toast.error(data.message.message, {
          description: DateTime.now().toLocaleString(DateTime.DATETIME_MED),
        });
        return;
      }

      toast.success('User deleted successfully', {
        description: DateTime.now().toLocaleString(DateTime.DATETIME_MED),
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error, {
        description: DateTime.now().toLocaleString(DateTime.DATETIME_MED),
      });
    } finally {
      fetchUsers();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete &quot;
            {user?.username ?? '-'}
            &quot;
          </DialogTitle>
          <DialogDescription>
            Dialog confirmation of deleting a user
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Alert className="flex flex-col space-y-1 bg-red-500 border-red-700" variant="info">
            <AlertTitle
              className="mb-0 font-semibold text-[12px] uppercase"
            >
              CAUTION!
            </AlertTitle>
            <div className="flex flex-col space-y-0.5">
              <AlertTitle className="font-semibold">
                Are you completely sure you want to delete user
                {' '}
                &quot;
                {user?.username ?? '-'}
                &quot;
                ?
              </AlertTitle>
              <AlertDescription>
                Confirming this action will delete the user permanently.
              </AlertDescription>
            </div>
          </Alert>
          <Separator />
        </div>
        <div className="flex justify-between items-center gap-2 mt-0">
          <Button
            className="flex-1 bg-red-600 w-full animate-pulse"
            onClick={() => handleDelete(user?.id)}
          >
            DELETE
          </Button>
          <DialogClose asChild>
            <Button className="flex-1 w-full" onClick={setIsDialogOpen}>
              Close
            </Button>
          </DialogClose>
        </div>

      </DialogContent>
    </Dialog>
  );
};
