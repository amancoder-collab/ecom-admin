'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from '@mui/material';
import Link from 'next/link';
import CustomTextField from '@/app/(dashboard)/components/forms/theme-elements/CustomTextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, LoginFormSchema } from '../form/schema';
import { useForm } from 'react-hook-form';
import { api } from '@/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FormTextField } from '@/app/(dashboard)/components/forms/theme-elements/FormTextField';

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

export const LoginTemplate = ({ title, subtitle, subtext }: loginType) => {
  const { register, handleSubmit, reset, control, setValue } =
    useForm<LoginFormSchema>({
      resolver: zodResolver(loginFormSchema),
      mode: 'onTouched',
    });

  const router = useRouter();

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      console.log(data);
      const response = await api.auth.login(data);
      console.log(response);
      toast.success('Login successful');
      router.push('/');
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
          >
            Email
          </Typography>
          <FormTextField name="email" control={control} placeholder="Email" />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>

          <FormTextField
            type="password"
            name="password"
            control={control}
            placeholder="Password"
          />
        </Box>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remeber this Device"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </form>
  );
};
