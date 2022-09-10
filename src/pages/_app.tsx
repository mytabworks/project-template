import '@client/assets/styles/bootstrap-theme.scss'
import '@client/assets/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from '@client/components/custom/Layout'

function Application({ Component, pageProps: {session, ...pageProps} }: AppProps) {
	
	return (
		<SessionProvider session={session}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</SessionProvider>
	)
}

export default Application
