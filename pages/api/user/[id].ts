import UserController from "@controller/User";
import Route from "@route";

export default Route.middleware(['connection']).resource(UserController, ["GET", "PUT", "PATCH", "DELETE"])