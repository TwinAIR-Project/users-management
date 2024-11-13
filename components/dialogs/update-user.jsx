import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

import isEmpty from 'lodash/isEmpty';
import { DateTime } from 'luxon';
import { toast } from 'sonner';
import { merge, omit } from 'lodash';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

import { CreateUserForm } from '../forms/create-user-form';
import { Button } from '../ui/button';
import { useUsers } from '@/app/contexts/UsersContext';
import { getDifference } from '@/app/lib/getDifference';

export const UpdateUser = ({
  userId, isDialogOpen, setIsDialogOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { fetchUser, updateUser, fetchUsers } = useUsers();

  const onSubmit = async (_user) => {
    try {
      const diff = getDifference(user, _user);
      console.log(omit(user, ['id']), diff);

      const data = await updateUser(user?.id, merge(omit(user, ['id']), diff));

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

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchUser(userId);
      setUser(data);
      setLoading(false);
    };

    if (!isEmpty(userId) && isDialogOpen) {
      setLoading(true);
      fetch();
    }
  }, [userId, isDialogOpen, fetchUser]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {loading && <p />}
            {!loading && (
            <>
              Edit &quot;
              {user?.username}
              &quot; user
            </>
            )}
          </DialogTitle>
        </DialogHeader>
        {loading
          ? (
            <div className="flex justify-center items-center w-full min-h-[150px]">
              <Icon icon="line-md:loading-loop" className="text-gray-600" />
            </div>
          )
          : (
            <CreateUserForm user={user} onSubmit={onSubmit}>
              <Button
                className="!mt-4 w-full"
                type="submit"
              >
                Edit User
              </Button>
            </CreateUserForm>
          )}
      </DialogContent>
    </Dialog>
  );
};
