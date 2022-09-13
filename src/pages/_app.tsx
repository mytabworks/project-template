import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from '@client/components/custom/Layout'
import UserInteractionChecker from '@client/components/UserInteractionChecker'
import '@client/assets/styles/bootstrap-theme.scss'
import '@client/assets/styles/globals.css'
import '@client/common/utils/nextPWAUpdate'

function Application({ Component, pageProps: {session, ...pageProps} }: AppProps) {
	
	return (
		<SessionProvider session={session}>
			<UserInteractionChecker>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</UserInteractionChecker>
		</SessionProvider>
	)
}

export default Application
