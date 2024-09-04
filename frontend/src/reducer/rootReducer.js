import { combineReducers } from "redux";
import messageReducer from "./messageReducer.js";

const rootReducer = combineReducers({
    messages: messageReducer,
    // Add other reducers here
});

export default rootReducer;
