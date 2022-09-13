import FeatureController from "@server/controller/Feature";
import { RoleType } from "@server/model/Role";
import Route from "@server/route";

export default Route.middleware([{ auth: [RoleType.ADMIN, RoleType.CLIENT] }]).get(FeatureController, 'nodemailer')