import UserController from "@controller/User";
import Route from "@route";

export default Route.middleware([{ auth: [1] }]).get(UserController, 'index')