import FeatureController from "@server/controller/Feature";
import Route from "@server/route";

export default Route.middleware(['auth']).post(FeatureController, 'unsubscribe')