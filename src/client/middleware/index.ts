import Illusion from 'illusionjs'
import Connection from '@server/connection';
import { getServerSession, Session } from '@server/session';

export const getBaseUrl = () => {
	if (typeof window !== "undefined") return window.location.origin; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
class ClientMiddleware {

	protected authorizeRoleIDs: number[] | null = null;

	protected failRedirects?: Record<any | 'default', string>;

	public roles(authorizeRoleIDs: number[]) {

		this.authorizeRoleIDs = authorizeRoleIDs

		return this
	}

	public redirects(failRedirects: Record<any | 'default', string>) {
		
		this.failRedirects = failRedirects

		return this
	}

	public unauth(callback?: (context: any, session: Session | null) => ({props: any})) {

		return async (context: any) => {

			await Connection.createIfNotExists()

			const session = await getServerSession(context)
			
			if(session) {

				if(this.failRedirects) {
					
					const role: any = session.user?.roles.find((role: any) => this.failRedirects![role])
					
					return {
						redirect: {
							destination: this.failRedirects[role] || this.failRedirects?.default || `/api/auth/signin?callbackUrl=${getBaseUrl()}`,
							permanent: false
						}
					}

				} else {
					
					return {
						redirect: {
							destination: `/api/auth/signin?callbackUrl=${getBaseUrl()}`,
							permanent: false
						}
					}
				}
	
			}
			
			return callback ? callback(context, session) : { props: { } }
		} 
	}

	public auth(callback?: (context: any, session: Session | null) => ({props: any})) {

		return async (context: any) => {

			await Connection.createIfNotExists()

			const session = await getServerSession(context)
			
			if(!session 
				|| !(session 
					&& session.user
					&& (
						(Array.isArray(this.authorizeRoleIDs) 
							&& this.authorizeRoleIDs.length > 0
							&& session.user?.roles.some((id) => this.authorizeRoleIDs?.includes(id)
						) 
						|| this.authorizeRoleIDs === null
					)
				))
			) {

				if(session && this.failRedirects) {

					const role: any = session.user?.roles.find((role: any) => this.failRedirects![role])
					
					return {
						redirect: {
							destination: this.failRedirects[role] || this.failRedirects?.default || `/api/auth/signin?callbackUrl=${getBaseUrl()}`,
							permanent: false
						}
					}

				} else {
					
					return {
						redirect: {
							destination: this.failRedirects?.default || `/api/auth/signin?callbackUrl=${getBaseUrl()}`,
							permanent: false
						}
					}
				}
	
			}
			
			return callback ? callback(context, session) : { props: { } }
		} 
	}

	public static __callStatic(method: string) {

        const instance: any = new ClientMiddleware()

        if(method in instance) {

            return (...parameters: any[]) => instance[method](...parameters)

        } else {

            throw Error(`ClientMiddleware has no method: ${method}`)
        }

    }
}

export default Illusion<InstanceType<typeof ClientMiddleware>>(ClientMiddleware)