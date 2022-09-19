import User from "@server/model/User";
import { ConnectionPool } from "eloquent.orm.js";
import webpush from "web-push"

webpush.setVapidDetails(
    'mailto:myproxyemailserver@gmail.com',
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
    process.env.WEB_PUSH_PRIVATE_KEY!
);

export default async (userIDs: number[], notification: { title: string; options: NotificationOptions}, cp: ConnectionPool) => {

    try {

        const users = await User
            .select('id', 'interacting')
            .whereIn('id', userIDs)
            .where('active', true)
            .with("webPushSubscriptions")
            .pool(cp)
            .get()

        const userOnline = users.filter((user) => user.interacting === true)
        const userOffline = users.filter((user) => user.interacting === false)

        await Promise.all(userOffline.map((user) => user.$webPushSubscriptions?.map((webPushSubscription) => {
            webpush.sendNotification({
                endpoint: webPushSubscription.endpoint!,
                keys: {
                    auth: webPushSubscription.key_auth!,
                    p256dh: webPushSubscription.key_p256dh!
                }
            }, JSON.stringify(notification));
        })).flat())
        
    } catch(error: any) {

        throw new Error(error)
    }
}