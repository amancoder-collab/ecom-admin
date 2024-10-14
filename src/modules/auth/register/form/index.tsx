'use client';
import G_icon from '@/../public/assets/images/G-icon.svg';
import { api } from '@/api';
import { IApiError } from '@/api/types';
import { populateError } from '@/modules/core/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { loginFormSchema, LoginFormSchema } from './schema';

interface LoginFormProps {}

export const LoginForm: FC<LoginFormProps> = () => {
	const router = useRouter();

	const form = useForm<LoginFormSchema>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(loginFormSchema),
	});

	const mutation = useMutation({
		mutationFn: (data: LoginFormSchema) => api.auth.login(data),
		onSuccess: (response) => {
			toast.success('Log in successfully.');
			router.push('/');
		},
		onError: (error: IApiError) => {
			if (error.response?.data.message) {
				toast.error(error.response.data.message);
			}
			populateError(form, error);
		},
	});

	const onSubmit = (data: LoginFormSchema) => {
		mutation.mutate(data);
	};

	const { register, handleSubmit } = form;

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col gap-2 w-full max-w-sm lg:max-w-md'
		>
			<div>
				<h2 className='text-2xl font-bold'>Welcome Back</h2>
				<p className='mt-1 text-lg font-semibold'>Login in your account</p>
			</div>
			<div className='flex flex-col gap-2 my-1 text-sm'>
				<div>
					<label htmlFor='email' className='font-semibold'>
						Email
					</label>
					<div className='mt-1'>
						<input
							type='text'
							{...register('email')}
							placeholder='Enter your email'
							className='border border-colors-grayBorder w-full p-2'
							required
						/>
					</div>
				</div>
				<div>
					<label htmlFor='password' className='font-semibold'>
						Password
					</label>
					<div className='relative mt-1'>
						<input
							type='password'
							id='password'
							{...register('password')}
							placeholder='Enter your password'
							className='border border-colors-grayBorder w-full p-2'
							required
						/>
						<p className='absolute top-3 right-2 text-xs font-medium text-colors-grayFont'>
							Show
						</p>
					</div>
				</div>
			</div>
			<div className='text-right'>
				<Link
					href='/forgot'
					className='text-colors-fontColor text-sm font-semibold hover:underline'
				>
					Forgot Password?
				</Link>
			</div>
			<div>
				<button
					type='submit'
					className='flex items-center justify-center bg-colors-themeColor font-semibold text-white w-full p-2 hover:underline'
				>
					Sign in
				</button>
			</div>
			<div>
				<button className='flex gap-2 items-center justify-center border border-colors-grayBorder w-full p-2 hover:underline'>
					<span>
						<Image src={G_icon} alt='Icon' width={20} height={100} />
					</span>
					Continue with Google
				</button>
			</div>
			<div className='text-center'>
				<p className='text-sm'>
					Didn't have an account?{' '}
					<Link href='/signup' className='font-semibold hover:underline'>
						Sign-up
					</Link>
				</p>
			</div>
		</form>
	);
};
