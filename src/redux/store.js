import { createStore } from "redux";
import reducer from "./reducer/reducer";
import { composeWithDevTools } from "redux-devtools-extension"

let store = createStore(reducer, composeWithDevTools());

export default store;
