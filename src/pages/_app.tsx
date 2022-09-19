import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from '@client/components/custom/Layout'
import UserInteractionChecker from '@client/components/UserInteractionChecker'
import SocketClient from '@client/components/SocketClient';
import SSRProvider from 'react-bootstrap/SSRProvider'
import 'retoast/dist/css/main.css'
import '@client/assets/styles/bootstrap-theme.scss'
import '@client/assets/styles/globals.css'
import '@client/pwa-update'

function Application({ Component, pageProps: {session, ...pageProps} }: AppProps) {
	
	return (
		<SSRProvider>
			<SessionProvider session={session}>
				<SocketClient>
					<UserInteractionChecker>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</UserInteractionChecker>
				</SocketClient>
			</SessionProvider>
		</SSRProvider>
	)
}

export default Application
