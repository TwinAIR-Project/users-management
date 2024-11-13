/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, cloneElement } from 'react';

import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import isEmpty from 'lodash/isEmpty';
import { SelectValue } from '@radix-ui/react-select';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetcher } from '@/app/lib/fetcher';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger,
} from '@/components/ui/select';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Switch } from '../ui/switch';
import { useToken } from '@/app/contexts/TokenContext';
import { useUsers } from '@/app/contexts/UsersContext';
import { DateTime } from 'luxon';

const formCreateSchema = z.object({
  username: z.string().min(1, {
    message: 'Username is required',
  }),
  email: z.string().email({
    message: 'Invalid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
  confirmPassword: z.string().min(1, {
    message: 'Confirm password is required',
  }),
  extra: z.object({
    tenant: z.string().min(1, {
      message: 'Tenant selection is required',
    }),
    type: z.string().min(1, {
      message: 'Type selection is required',
    }),
    firstName: z.string().min(1, {
      message: 'First name is required',
    }),
    lastName: z.string().min(1, {
      message: 'Last name is required',
    }),
    admin: z.boolean(),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const formUpdateSchema = z.object({
  username: z.string().min(1, {
    message: 'Username is required',
  }),
  email: z.string().email({
    message: 'Invalid email address',
  }),
  extra: z.object({
    tenant: z.string().min(1, {
      message: 'Tenant selection is required',
    }),
    type: z.string().min(1, {
      message: 'Type selection is required',
    }),
    firstName: z.string().min(1, {
      message: 'First name is required',
    }),
    lastName: z.string().min(1, {
      message: 'Last name is required',
    }),
    admin: z.boolean(),
  }),
});

export const CreateUserForm = ({ user, children, onSubmit }) => {
  const { tenants } = useUsers();

  const form = useForm({
    resolver: zodResolver(user ? formUpdateSchema : formCreateSchema),
    mode: 'onSubmit',
    defaultValues: {
      ...user,
      enabled: user?.enabled ?? false,
      extra: {
        tenant: user?.extra?.tenant ?? null,
        type: user?.extra?.type ?? 'user',
        firstName: user?.extra?.firstName ?? '',
        lastName: user?.extra?.lastName ?? '',
        admin: user?.extra?.admin ?? false,
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1.5">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="partner-username (eg. etraid-balbert)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between space-x-4 w-full">
          <FormField
            className="flex-1"
            control={form.control}
            name="extra.firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="extra.lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {!user && (
          <div className="flex justify-between space-x-4 w-full">
            <FormField
              className="flex-1"
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="**********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              className="flex-1"
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState: { error } }) => (
                <FormItem className="flex-1">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="**********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-between items-center gap-4">
          <Controller
            name="extra.tenant"
            control={form.control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex-1">
                <FormLabel htmlFor="tenant">Tenant</FormLabel>
                <FormControl asChild>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="font-medium text-black">
                      <SelectValue placeholder="Select a tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem
                          key={tenant}
                          value={tenant}
                          className="font-semibold text-[12px] text-black uppercase"
                        >
                          {tenant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Controller
            name="extra.type"
            control={form.control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex-1">
                <FormLabel htmlFor="type">Type</FormLabel>
                <FormControl asChild>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="font-medium text-black">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {['human', 'system'].map((tenant) => (
                        <SelectItem
                          key={tenant}
                          value={tenant}
                          className="font-semibold text-[12px] text-black uppercase"
                        >
                          {tenant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between items-center gap-4 py-2 w-full">
          <FormField
            className="flex-1"
            control={form.control}
            name="extra.admin"
            render={({ field }) => (
              <FormItem className="flex flex-1 justify-between items-center !m-0">
                <FormLabel className="pt-1">Admin</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    {...field}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="py-3">{children}</div>
      </form>
    </Form>
  );
};
