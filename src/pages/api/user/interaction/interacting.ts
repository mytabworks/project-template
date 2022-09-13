import UserController from "@server/controller/User";
import Route from "@server/route";

export default Route.middleware(['auth']).post(UserController, 'interaction')