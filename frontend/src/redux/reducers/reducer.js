import {ajax} from "../../ajax";
import {combineEpics} from "redux-observable";

const INIT_STATE = {
    todoList: []
};

const REFRESH_LIST = 'REFRESH_LIST';
const RECEIVE_LIST = 'RECEIVE_LIST';
const ADD_ITEM = 'ADD_ITEM';
const UPDATE_ITEM = 'UPDATE_ITEM';
const DELETE_ITEM = 'DELETE_ITEM';

export const refreshList = () => ({type: REFRESH_LIST});
export const receiveList = list => ({type: RECEIVE_LIST, list});

export const addItem = (item) => ({type: ADD_ITEM, item});
export const updateItem = (item) => ({type: UPDATE_ITEM, item});
export const deleteItem = (item) => ({type: DELETE_ITEM, item});

const reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case RECEIVE_LIST: {
            return {
                ...state,
                todoList: action.list
            }
        }

        default:
            return state;
    }
};

const refreshListEpic = (action$, store) =>
    action$.ofType(REFRESH_LIST)
        .map(() =>
            ajax('/api/todos/')
                .then(response => response.json())
                .then(receiveList))
        .flatMap(actions => actions);

const addItemEpic = (action$, store) =>
    action$.ofType(ADD_ITEM)
        .map(({item}) =>
            ajax('/api/todos/', {
                method: 'POST',
                body: JSON.stringify(item)
            })
                .then(refreshList))
        .flatMap(actions => actions);

const updateItemEpic = (action$, store) =>
    action$.ofType(UPDATE_ITEM)
        .map(({item}) =>
            ajax(`/api/todos/${item.id}/`, {
                method: 'PUT',
                body: JSON.stringify(item)
            })
                .then(refreshList))
        .flatMap(actions => actions);

const deleteItemEpic = (action$, store) =>
    action$.ofType(DELETE_ITEM)
        .map(({item}) =>
            ajax(`/api/todos/${item.id}/`, {
                method: 'DELETE',
                body: JSON.stringify(item)
            })
                .then(refreshList))
        .flatMap(actions => actions);

const rootEpic = combineEpics(
    refreshListEpic,
    addItemEpic,
    updateItemEpic,
    deleteItemEpic);

export {reducer, rootEpic};