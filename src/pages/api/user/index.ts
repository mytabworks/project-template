import UserController from "@server/controller/User";
import Route from "@server/route";

export default Route.middleware([{ auth: [1, 3] }]).get(UserController, 'index')