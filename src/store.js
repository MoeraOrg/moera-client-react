import { combineReducers, createStore } from "redux";
import root from "./global/rootReducer";
import owner from "./mainmenu/ownerReducer";

export default createStore(combineReducers({root, owner}));
