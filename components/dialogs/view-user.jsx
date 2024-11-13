import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import isEmpty from 'lodash/isEmpty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

import { useToken } from '@/app/contexts/TokenContext';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { useUsers } from '@/app/contexts/UsersContext';

export const ViewUser = ({
  userId, isDialogOpen, setIsDialogOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const { token } = useToken();
  const { fetchUser } = useUsers();

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchUser(userId);
      console.log(data);
      setUser(data);
      setLoading(false);
    };

    if (!isEmpty(token) && !isEmpty(userId) && isDialogOpen) {
      setLoading(true);
      fetch();
    }
  }, [token, userId, isDialogOpen, fetchUser]);

  if (loading || user === null) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <div className="flex justify-center items-center w-full min-h-[150px]">
            <Icon icon="line-md:loading-loop" className="text-gray-600" />
          </div>
          <DialogClose asChild>
            <Button className="mt-6 w-full" onClick={setIsDialogOpen}>
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            View &quot;
            {user?.username}
            &quot; user
          </DialogTitle>
          <DialogDescription>
            View details of the user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Alert className="flex flex-col space-y-3" variant="info">
            <AlertTitle className="mb-0 font-semibold text-[12px] text-center uppercase">Basic</AlertTitle>
            <div className="flex flex-col space-y-0.5">
              <AlertTitle className="font-semibold">Username</AlertTitle>
              <AlertDescription>
                <span>{user.username}</span>
              </AlertDescription>
            </div>
            <Separator />
            <div className="flex flex-col space-y-0.5">
              <AlertTitle className="font-semibold">Email</AlertTitle>
              <AlertDescription>
                <span>{user.email}</span>
              </AlertDescription>
            </div>
            <Separator />
            <div className="flex justify-between">
              <div className="flex flex-col flex-1 space-y-0.5 grow-2">
                <AlertTitle className="font-semibold">Description</AlertTitle>
                <AlertDescription>
                  <span>{isEmpty(user?.description) ? '-' : user?.description}</span>
                </AlertDescription>
              </div>
              <Separator orientation="a" />
              <div className="flex flex-col flex-1 space-y-0.5">
                <AlertTitle className="font-semibold">Type</AlertTitle>
                <AlertDescription>
                  <span>{isEmpty(user?.extra?.type) ? '-' : user?.extra?.type}</span>
                </AlertDescription>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between">
              <div className="flex flex-col flex-1 space-y-0.5">
                <AlertTitle className="font-semibold">First Name</AlertTitle>
                <AlertDescription>
                  <span>{user?.extra?.firstName ?? '-'}</span>
                </AlertDescription>
              </div>
              <Separator orientation="a" />
              <div className="flex flex-col flex-1 space-y-0.5">
                <AlertTitle className="font-semibold">Last Name</AlertTitle>
                <AlertDescription>
                  <span>{user?.extra?.lastName ?? '-'}</span>
                </AlertDescription>
              </div>
            </div>
          </Alert>
          <Separator />
          <Alert className="flex flex-col space-y-3 border-orange-400 bg-orange-200" variant="info">
            <AlertTitle className="mb-0 font-semibold text-[12px] text-center uppercase">Keyrock</AlertTitle>
            <div className="flex justify-between gap-2">
              <div className="flex flex-1 justify-between items-center space-y-0.5">
                <AlertTitle className="font-medium">Enabled</AlertTitle>
                <AlertDescription>
                  <Checkbox checked={user?.enabled} disabled />
                </AlertDescription>
              </div>
              <Separator orientation="a" />
              <div className="flex flex-1 justify-between items-center space-y-0.5">
                <AlertTitle className="font-medium">Admin</AlertTitle>
                <AlertDescription>
                  <Checkbox checked={user?.extra?.admin} disabled />
                </AlertDescription>
              </div>
            </div>
          </Alert>
          <Separator />
          <Alert className="flex flex-col space-y-3 bg-blue-200 border-blue-400" variant="info">
            <AlertTitle className="mb-0 font-semibold text-[12px] text-center uppercase">Orion & QuantumLeap</AlertTitle>
            <div className="flex flex-col space-y-0.5">
              <AlertTitle className="font-semibold">Tenant Microservices</AlertTitle>
              <AlertDescription>
                {user?.extra?.tenant
                  ? (<Badge className="bg-blue-500 border-blue-600">{user?.extra?.tenant ?? '-'}</Badge>
                  ) : '-'}
              </AlertDescription>
            </div>
          </Alert>
        </div>
        <DialogClose asChild>
          <Button className="mt-6 w-full" onClick={setIsDialogOpen}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
