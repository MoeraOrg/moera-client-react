import { combineReducers } from "redux";
import root from "./rootReducer";
import owner from "./ownerReducer";

export default combineReducers({root, owner});
