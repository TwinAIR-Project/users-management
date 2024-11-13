'use client';

import React from 'react';

import { signIn } from 'next-auth/react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

export const Auth = () => (
  <div className="min-h-dvh min-w-dvw flex items-center justify-center">
    <Card className="mx-auto w-full max-w-sm min-h-xl flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex flex-col justify-center items-center gap-1 font-bold text-[18px] text-center">
          <img
            src="images/twinair-full.png"
            className="w-auto h-[120px]"
            alt="TwinAir logo"
          />
          Login to Users Management App
          <div className="flex flex-col gap-0.5">
            <p className="font-medium text-xs tracking-wide">Application in charge of managing users</p>
            <p className="font-semibold text-xs tracking-wide">Developed by ETRA I+D </p>
          </div>

        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <Button
          onClick={() => signIn('keyrock', { callbackUrl: '/users' })}
          type="submit"
          className="flex justify-center items-center gap-2 bg-yellow-500 px-4 py-2 rounded-md w-full text-black"
        >
          Log in with
          <img src="images/keyrock-logo.png" className="w-auto h-[20px]" alt="Keyrock logo" />
        </Button>
      </CardContent>
    </Card>
  </div>

);
