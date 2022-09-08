import UserController from "@controller/User";
import Route from "@route";

export default Route.middleware(['auth']).resource(UserController, ["GET", "PUT", "PATCH", "DELETE"])