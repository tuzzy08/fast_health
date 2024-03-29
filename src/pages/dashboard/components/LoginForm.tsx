import {
	Paper,
	createStyles,
	TextInput,
	PasswordInput,
	Button,
	Title,
	Text,
} from '@mantine/core';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IconAlertTriangle } from '@tabler/icons';
import { useAuth } from '../../../lib/auth/useAuth';
import { showNotification } from '@mantine/notifications';

type Inputs = {
	email: string;
	password: string;
};

const useStyles = createStyles((theme) => ({
	form: {
		height: 450,
		width: 500,
		paddingTop: 20,

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			maxWidth: '100%',
		},
	},

	title: {
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
	},

	logo: {
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		width: 120,
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
}));

export default function LoginForm({ setVisibleForm }: any) {
	const { classes } = useStyles();
	const { signIn, setAuthToken } = useAuth();

	//TODO: USE RIGHT INPUT PROP TYPES
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();
	const handleLogin: SubmitHandler<Inputs> = async (form_data) => {
		try {
			if (signIn) {
				const res = await signIn({
					email: form_data.email.trim(),
					password: form_data.password.trim(),
				});
				if (res?.data.user === null) {
					showNotification({
						title: 'Fast Health',
						message: `${res.message}`,
						color: 'red',
						icon: <IconAlertTriangle />,
						autoClose: 5000,
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	};
	const changeForm = () => setVisibleForm('signup');
	return (
		<Paper className={classes.form} radius={15} p={30}>
			<Title order={2} className={classes.title} align='center' mt='md' mb={50}>
				Welcome to Fast Health
			</Title>
			{/* Login Form */}
			<form onSubmit={handleSubmit(handleLogin)}>
				<TextInput
					label='Email address'
					placeholder='hello@gmail.com'
					size='md'
					{...register('email')}
				/>
				<PasswordInput
					label='Password'
					placeholder='Your password'
					mt='md'
					size='md'
					{...register('password')}
				/>
				{/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}

				<Button fullWidth mt='xl' size='md' type='submit'>
					Login
				</Button>
			</form>
			<Text align='center' mt='md'>
				Don&apos;t have an account?{' '}
				<Link href='' onClick={changeForm}>
					<Text weight={700}>Register</Text>
				</Link>
			</Text>
		</Paper>
	);
}
