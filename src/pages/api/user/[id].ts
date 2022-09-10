import UserController from "@server/controller/User";
import Route from "@server/route";

export default Route.middleware(['auth']).resource(UserController, ["GET", "PUT", "PATCH", "DELETE"])