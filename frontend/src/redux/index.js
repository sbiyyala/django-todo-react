import {applyMiddleware, combineReducers, createStore} from "redux";
import {reducer, rootEpic} from "./reducers/reducer";
import {combineEpics, createEpicMiddleware} from "redux-observable";

const reducers = {reducer};
const epics = [rootEpic];

const epicMiddleware = createEpicMiddleware(combineEpics(...epics));
const rootReducer = combineReducers(reducers);

const store = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware));

export {store};