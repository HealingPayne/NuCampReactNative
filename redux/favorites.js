import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITE:
            //If exists
            if (state.includes(action.payload)) {
                return state;
            }
            //Add new Favorite
            return state.concat(action.payload);
        default:
            return state;
    }
};