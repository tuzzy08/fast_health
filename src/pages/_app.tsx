import { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { AuthProvider } from '../contexts/AuthContext';
// import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App(props: AppProps | any) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {},
				},
			})
	);
	const { Component, pageProps } = props;
	const getLayout = Component.getLayout ?? ((page: typeof Component) => page);
	const [supabase] = useState(() => createBrowserSupabaseClient());
	const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	return (
		<>
			{/* <UserProvider> */}
			<ColorSchemeProvider
				colorScheme={colorScheme}
				toggleColorScheme={toggleColorScheme}
			>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{ colorScheme }}
				>
					<NotificationsProvider position='top-right' zIndex={2077}>
						<QueryClientProvider client={queryClient}>
							<SessionContextProvider
								supabaseClient={supabase}
								initialSession={pageProps.initialSession}
							>
								<AuthProvider>
									<Hydrate state={pageProps.dehydratedState}>
										{getLayout(<Component {...pageProps} />)}
									</Hydrate>
								</AuthProvider>
							</SessionContextProvider>
						</QueryClientProvider>
					</NotificationsProvider>
				</MantineProvider>
			</ColorSchemeProvider>
			{/* </UserProvider> */}
		</>
	);
}
