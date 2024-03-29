import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import {
	Badge,
	Box,
	Button,
	Card,
	Center,
	Checkbox,
	Flex,
	Group,
	Modal,
	Stack,
	Table,
	Text,
	TextInput,
	useMantineTheme,
} from '@mantine/core';
import {} from '@tabler/icons';
import { GetServerSidePropsContext } from 'next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Layout } from '../../../layouts';
import axios from 'axios';
import { useAuth } from '../../../lib/auth';
import { PageProps } from '../types';
import ParamedicNote from '../components/ParamedicNote';

type Inputs = {
	patientID: string;
};

Index.getLayout = function getLayout(page: any) {
	return <Layout variant={'ems'}>{page}</Layout>;
};

export default function Index({ user }: PageProps) {
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);
	const [patientInfo, setpatientInfo] = useState<any>('');
	const { authToken } = useAuth();

	const handleSearch: SubmitHandler<Inputs> = async (form_data) => {
		try {
			const { data } = await axios.post(
				`/api/users/${form_data.patientID.trim()}`,
				{
					token: authToken,
					id: user.user_metadata.id,
					email: user.email,
				}
			);
			data ? setpatientInfo(data) : null;
			reset((formValues) => ({
				...formValues,
				patientID: '',
			}));
		} catch (error) {
			console.log(error);
		}
	};

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const ths = (
		<tr>
			<th>Patient ID</th>
			<th>Patient Name</th>
			{/* <th>Email</th> */}
			<th>Actions</th>
		</tr>
	);

	return (
		<Stack spacing={'xl'}>
			<Modal
				opened={opened}
				size='70%'
				closeButtonLabel='Close Note'
				closeOnEscape={false}
				closeOnClickOutside={false}
				overlayColor={
					theme.colorScheme === 'dark'
						? theme.colors.dark[9]
						: theme.colors.gray[2]
				}
				overlayOpacity={0.55}
				overlayBlur={3}
				onClose={() => setOpened(false)}
				title='Create new note'
			>
				<ParamedicNote
					patientID={`${patientInfo.patientID}`}
					patientName={`${patientInfo.full_name}`}
					paramedic={user}
					setOpened={setOpened}
					setpatientInfo={setpatientInfo}
				/>
			</Modal>

			<Card
				shadow='sm'
				radius={'md'}
				p='md'
				w='650px'
				mah={600}
				withBorder
				mt='xs'
			>
				<Group position='apart' mb='lg'>
					<Text weight={500}>Search for patient</Text>
					<Badge
						variant='gradient'
						gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }}
					>
						{`ID: ${user.user_metadata.id}`}
					</Badge>
				</Group>
				<form onSubmit={handleSubmit(handleSearch)}>
					<Stack align='flex-start'>
						<TextInput
							label='Enter patient ID'
							placeholder='user-5cbda-2345'
							{...register('patientID')}
						/>

						<Button variant='outline' mt='sm' size='md' type='submit'>
							Submit
						</Button>
					</Stack>
				</form>
			</Card>

			<Card shadow='sm' radius={'md'} p='md' w='700px'>
				<Table highlightOnHover>
					<caption>Patient details</caption>
					<thead>{ths}</thead>
					<tbody>
						{patientInfo ? (
							<tr>
								<td>{patientInfo.patientID}</td>
								<td>{patientInfo.full_name}</td>
								{/* <td></td> */}
								<td>
									<Button onClick={() => setOpened(true)} variant='outline'>
										Create Note
									</Button>
								</td>
							</tr>
						) : (
							<></>
						)}
					</tbody>
				</Table>
			</Card>
		</Stack>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// Create authenticated Supabase Client
	const supabase = createServerSupabaseClient(ctx);
	// Check if we have a session
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session || session.user.user_metadata.accountType !== 'Ems')
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};

	return {
		props: {
			initialSession: session,
			user: session.user,
		},
	};
};
