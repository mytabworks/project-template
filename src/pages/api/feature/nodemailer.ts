import FeatureController from "@server/controller/Feature";
import Route from "@server/route";

export default Route.middleware([{ auth: [1, 3] }]).get(FeatureController, 'nodemailer')