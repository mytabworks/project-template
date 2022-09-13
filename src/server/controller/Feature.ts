import { NextApiResponse } from "next";
import BaseController from "./BaseController";
import nodemailer from "nodemailer"
import webpush from "web-push"
import { NextApiRequestWithSession } from "@server/session";
import UserSubscription from "@server/model/UserWebPushSubscription";
import User from "@server/model/User";
import { ConnectionPool } from "eloquents";
import UserWebPushSubscription from "@server/model/UserWebPushSubscription";

webpush.setVapidDetails(
    'mailto:myproxyemailserver@gmail.com',
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
    process.env.WEB_PUSH_PRIVATE_KEY!
);

class FeaturesController extends BaseController {

    public static async generateVAPIDkeys(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        try {

            response.status(200).json({
                success: true,
                data: webpush.generateVAPIDKeys(),
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    public static async webpush(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        try {
            const body = request.body
            const session = request.session

            const user = await User.find(session?.user.id!, ["id"], "webPushSubscriptions")

            await Promise.all(user.$webPushSubscriptions?.map((webPushSubscription) => {
                webpush.sendNotification({
                    endpoint: webPushSubscription.endpoint!,
                    keys: {
                        auth: webPushSubscription.key_auth!,
                        p256dh: webPushSubscription.key_p256dh!
                    }
                }, JSON.stringify({
                    "title": "Bug TEST Sample", 
                    "options": {
                        "icon": "http://localhost:3000/vercel.svg",
                        "silent": false ,
                        "body": "This web app is being served cache-first by a service worker. To learn more, visit"
                    }
                }));
            }) || [])

            response.status(200).json({
                success: true,
                message: "send successfully"
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    public static async subscribe(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        const cp = new ConnectionPool()
        try {

            await cp.open()

            const body = request.body
            const session = request.session

            const user = await User.find(session?.user.id!, ["id"], cp)

            if(user.exists === false) {
                return response.status(200).json({
                    success: false,
                    message: "User doesn't exist"
                })
            }

            const subs = user.webPushSubscriptions().create()

            subs.endpoint = body.endpoint
            subs.expiration_time = body.expirationTime
            subs.key_auth = body.keys.auth
            subs.key_p256dh = body.keys.p256dh

            await subs.save(cp)


            response.status(200).json({
                success: true,
                message: "Subscribe Push Notification successfully",
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        } finally {

            await cp.close()
        }
    }

    public static async unsubscribe(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        try {
            const body = request.body
            const session = request.session

            const subs = await UserWebPushSubscription
                .where('user_id', session?.user.id!)
                .where('endpoint', body.endpoint)
                .where('key_auth', body.keys.auth)
                .where('key_p256dh', body.keys.p256dh)
                .first()

            if(subs.exists === true) {
                await subs.delete()
            }

            return response.status(200).json({
                success: true,
                message: "Unsubscribe Push Notification successfully",
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    public static async nodemailer(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        try {
            const session = request.session

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "myproxyemailserver@gmail.com",
                    pass: "xxxxxxx"
                }
            })

            const trans = await transporter.sendMail({
                from: '"Boooo 👻" <foo@example.com>', // sender address
                to: session?.user.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });

            response.status(200).json({
                success: true,
                data: trans,
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

export default FeaturesController