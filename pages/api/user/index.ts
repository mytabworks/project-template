import UserController from "@controller/User";
import Route from "@route";

export default Route.middleware(['connection']).get(UserController, 'index')