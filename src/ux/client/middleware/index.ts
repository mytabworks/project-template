import { Session } from "@middleware/Auth"
import { getSession } from "next-auth/react"
import Illusion from 'illusionjs'

const nextauth_url = process.env.NEXT_PUBLIC_API_URL
class ClientMiddleware {

	protected authorizeRoleIDs: number[] = [];

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

			const session = await getSession(context)
			
			if(session) {

				if(this.failRedirects) {
					
					const role: any = session.user?.roles.find((role: any) => this.failRedirects![role])
					
					return {
						redirect: {
							destination: this.failRedirects[role] || this.failRedirects?.default || `/api/auth/signin?callbackUrl=${nextauth_url}`,
							permanent: false
						}
					}

				} else {
					
					return {
						redirect: {
							destination: `/api/auth/signin?callbackUrl=${nextauth_url}`,
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

			const session = await getSession(context)
			
			if(!session 
				|| !(session 
					&& Array.isArray(this.authorizeRoleIDs) 
					&& this.authorizeRoleIDs.length > 0
					&& session.user?.roles.some((id) => this.authorizeRoleIDs.includes(id))
				)
			) {

				if(session && this.failRedirects) {

					const role: any = session.user?.roles.find((role: any) => this.failRedirects![role])
					
					return {
						redirect: {
							destination: this.failRedirects[role] || this.failRedirects?.default || `/api/auth/signin?callbackUrl=${nextauth_url}`,
							permanent: false
						}
					}

				} else {
					
					return {
						redirect: {
							destination: this.failRedirects?.default || `/api/auth/signin?callbackUrl=${nextauth_url}`,
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